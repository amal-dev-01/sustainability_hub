from django.urls import path
from projects import views

urlpatterns = [
    path('projects/', views.ProjectListCreateAPIView.as_view(), name='project_list_create'),
    path('projects/<int:pk>/', views.ProjectDetailAPIView.as_view(), name='project_detail'),

    path('contributors/', views.ContributorListCreateAPIView.as_view(), name='contributor_list_create'),
    path('contributors/<int:pk>/', views.ContributorDetailAPIView.as_view(), name='contributor_detail'),

    path('tasks/', views.TaskListCreateAPIView.as_view(), name='task_list_create'),
    path('tasks/<int:pk>/', views.TaskDetailAPIView.as_view(), name='task_detail'),

    path("projects/<int:project_id>/tasks/", views.ProjectTasksAPIView.as_view(), name="project_tasks"),
    path('tasks/due/', views.DueTaskListAPIView.as_view(), name='due_task_list'),
    path('tasks/overdue/', views.OverDueTaskListAPIView.as_view(), name='over_due_task_list'),
    path('dashboard/', views.DashboardSummaryAPIView.as_view(), name='dashboard_summary'),


]