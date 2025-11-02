from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class SearchFilterOrderingMixin:
    """
    mixin for search, filtering, ordering, and pagination in APIView.
    """

    search_fields = []
    filter_fields = []
    ordering_fields = []
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        raise NotImplementedError("You must define get_queryset() in the subclass.")

    def apply_search_filter_ordering(self, queryset, request):
        search = request.query_params.get('search')
        if search and self.search_fields:
            q_obj = Q()
            for field in self.search_fields:
                q_obj |= Q(**{f"{field}__icontains": search})
            queryset = queryset.filter(q_obj)

        
        for field in self.filter_fields:
            value = request.query_params.get(field)
            if value is not None and value != "":
                if value.lower() in ["true", "false"]:
                    value = value.lower() == "true"
                queryset = queryset.filter(**{field: value})

        ordering = request.query_params.get('ordering')
        if ordering and ordering.lstrip('-') in self.ordering_fields:
            queryset = queryset.order_by(ordering)

        return queryset


    def paginate(self, queryset, request, serializer_class):
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = serializer_class(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
