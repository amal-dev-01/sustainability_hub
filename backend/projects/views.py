from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import date
from django.db.models import Count, Q
from django.conf import settings
import logging
from projects.utils.cache_utils import (
    generate_cache_key,
    get_cached_data,
    set_cached_data,
)
from projects.mixins import SearchFilterOrderingMixin
from projects.models import Project, Contributor, Task
from projects.serializers import ProjectSerializer, ContributorSerializer, TaskSerializer

logger = logging.getLogger(__name__)


# Project CRUD
class ProjectListCreateAPIView(APIView, SearchFilterOrderingMixin):

    search_fields = ['name', 'status', 'location']
    filter_fields = ['status', 'location']
    ordering_fields = ['name', 'created_at', 'status']

    def get_queryset(self):
        return Project.objects.all()

    def get(self, request):
        try:
            queryset = self.get_queryset()
            queryset = self.apply_search_filter_ordering(queryset, request)
            return self.paginate(queryset, request, ProjectSerializer)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Project created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )



class ProjectDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Project, pk=pk)

    def get(self, request, pk):
        project = self.get_object(pk)
        serializer = ProjectSerializer(project)
        return Response(serializer.data)

    def put(self, request, pk):
        project = self.get_object(pk)
        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Project updated", "data": serializer.data})
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        project = self.get_object(pk)
        project.delete()
        return Response({"message": "Project deleted"}, status=status.HTTP_204_NO_CONTENT)



# Contributor CRUD
class ContributorListCreateAPIView(APIView, SearchFilterOrderingMixin):

    search_fields = ['user__name', 'user__email']
    filter_fields = ['user__name', 'user__email']
    ordering_fields = ['user__name', 'user__email']

    def get_queryset(self):
        return Contributor.objects.select_related('user').all()

    def get(self, request):
        try:
            queryset = self.get_queryset()
            queryset = self.apply_search_filter_ordering(queryset, request)
            return self.paginate(queryset, request, ContributorSerializer)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        serializer = ContributorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Contributor created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )



class ContributorDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Contributor, pk=pk)

    def get(self, request, pk):
        contributor = self.get_object(pk)
        serializer = ContributorSerializer(contributor)
        return Response(serializer.data)

    def put(self, request, pk):
        contributor = self.get_object(pk)
        serializer = ContributorSerializer(contributor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Contributor updated", "data": serializer.data})
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        contributor = self.get_object(pk)
        contributor.delete()
        return Response({"message": "Contributor deleted"}, status=status.HTTP_204_NO_CONTENT)



# Task CRUD
class TaskListCreateAPIView(APIView, SearchFilterOrderingMixin):

    search_fields = ['title', 'description', 'project__name']
    filter_fields = ['is_completed', 'project', 'is_overdue']
    ordering_fields = ['title', 'due_date', 'created_at']

    def get_queryset(self):
        return Task.objects.select_related('project').prefetch_related('assigned_to').all()

    def get(self, request):
        try:
            queryset = self.get_queryset()
            queryset = self.apply_search_filter_ordering(queryset, request)
            return self.paginate(queryset, request, TaskSerializer)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save()
            return Response(
                {"message": "Task created successfully", "data": TaskSerializer(task).data},
                status=status.HTTP_201_CREATED
            )
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailAPIView(APIView):

    def get_object(self, pk):
        return get_object_or_404(Task, pk=pk)

    def get(self, request, pk):
        task = self.get_object(pk)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def put(self, request, pk):
        task = self.get_object(pk)
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Task updated successfully", "data": serializer.data})
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        task = self.get_object(pk)
        task.delete()
        return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



# Contributor Dashboard Summary
class DashboardSummaryAPIView(APIView):
    def get(self, request):
        try:
            total_projects = Project.objects.count()
            active_projects = Project.objects.filter(status="ACTIVE").count()
            completed_projects = Project.objects.filter(status="COMPLETED").count()
            on_hold_projects = Project.objects.filter(status="ON_HOLD").count()

            total_tasks = Task.objects.count()
            completed_tasks = Task.objects.filter(is_completed=True).count()
            overdue_tasks = Task.objects.filter(is_overdue=True).count()
            pending_tasks = total_tasks - completed_tasks

            total_contributors = Contributor.objects.count()

            project_summary = list(
                Project.objects.annotate(
                    total_tasks=Count('tasks'),
                    completed_tasks=Count('tasks', filter=Q(tasks__is_completed=True)),
                    overdue_tasks=Count('tasks', filter=Q(tasks__is_overdue=True)),
                )
                .values('id', 'name', 'status', 'total_tasks', 'completed_tasks', 'overdue_tasks')
                .order_by('-created_at')[:5]
            )
            data = {
                "projects": {
                    "total": total_projects,
                    "active": active_projects,
                    "completed": completed_projects,
                    "on_hold": on_hold_projects,
                },
                "tasks": {
                    "total": total_tasks,
                    "completed": completed_tasks,
                    "pending": pending_tasks,
                    "overdue": overdue_tasks,
                },
                "contributors": {
                    "total": total_contributors,
                },
                "recent_projects": project_summary,
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Get all tasks under a single project
class ProjectTasksAPIView(APIView):
    def get(self, request, project_id):
        project = get_object_or_404(Project, pk=project_id)
        tasks = Task.objects.filter(project=project).order_by("-created_at")
        serializer = TaskSerializer(tasks, many=True)
        return Response(
            {
                "project": project.name,
                "count": tasks.count(),
                "tasks": serializer.data,
            },
            status=status.HTTP_200_OK,
        )



# Due Task Task 
class DueTaskListAPIView(APIView, SearchFilterOrderingMixin):

    search_fields = ['title', 'description', 'project__name']
    filter_fields = ['is_completed', 'project']
    ordering_fields = ['title', 'due_date', 'created_at']

    def get_queryset(self):
        return Task.objects.filter(is_completed=False, due_date__lte=date.today()).select_related('project').prefetch_related('assigned_to').all()

    def get(self, request):
        try:
            queryset = self.get_queryset()
            queryset = self.apply_search_filter_ordering(queryset, request)
            return self.paginate(queryset, request, TaskSerializer)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)





CACHE_TTL = getattr(settings, 'CACHE_TTL', 300)

# Over Due Task List
class OverDueTaskListAPIView(APIView, SearchFilterOrderingMixin):
    search_fields = ['title', 'description', 'project__name']
    filter_fields = ['is_completed', 'project']
    ordering_fields = ['title', 'due_date', 'created_at']
    CACHE_KEY_PREFIX = "due_tasks"

    def get_queryset(self):
        return (
            Task.objects.filter(is_overdue=True)
            .select_related('project')
            .prefetch_related('assigned_to')
        )
    def get(self, request):
        try:
            cache_key = generate_cache_key(self.CACHE_KEY_PREFIX, request)
            cached_data = get_cached_data(cache_key)
            if cached_data:
                logger.info("[OverDueTaskListAPIView] ******* From cache *******")
                return Response(cached_data, status=status.HTTP_200_OK)
            
            queryset = self.get_queryset()
            queryset = self.apply_search_filter_ordering(queryset, request)
            serializer = TaskSerializer(queryset, many=True)
            response_data = serializer.data
            set_cached_data(cache_key, response_data, timeout=CACHE_TTL)
            logger.info('[OverDueTaskListAPIView] ******* From DB *******')
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



