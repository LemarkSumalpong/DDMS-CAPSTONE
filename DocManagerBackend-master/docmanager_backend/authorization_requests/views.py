from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from accounts.permissions import IsHead, IsStaff
from django.utils.dateparse import parse_datetime
from rest_framework.pagination import PageNumberPagination
from .serializers import (
    AuthorizationRequestCreationSerializer,
    AuthorizationRequestSerializer,
    AuthorizationRequestUpdateSerializer,
    AuthorizationRequestUnitUpdateSerializer
)
from django.db.models import Case, When, Value, IntegerField

from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import AuthorizationRequest, AuthorizationRequestUnit
from django.db.models import F

class AuthorizationRequestPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 8

    


class AuthorizationRequestCreateView(generics.CreateAPIView):
    """
    Used by clients to create authorization requests. Requires passing in request information in addition to the documents themselves
    """

    http_method_names = ["post"]
    serializer_class = AuthorizationRequestCreationSerializer
    permission_classes = [IsAuthenticated]


class AuthorizationRequestListView(generics.ListAPIView):
    """
    Returns authorization requests. If authorization requests are approved, also returns the link to download the document.
    Staff/Head are able to view all authorization requests here. Clients are only able to view their own requests.
    """

    http_method_names = ["get"]
    serializer_class = AuthorizationRequestSerializer
    pagination_class = AuthorizationRequestPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = AuthorizationRequest.objects.all()

        # Filter by requester if the user is a client
        if user.role == "client":
            queryset = queryset.filter(requester=user)

        # Filter by status if it's provided in the query parameters
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)

        # Filter by date range if it's provided
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            queryset = queryset.filter(date_requested__range=[start_date, end_date])

        # Ensure "unclaimed" status appears first, then apply the dynamic sorting
        queryset = queryset.order_by(
            Case(
                When(status='unclaimed', then=Value(0)),
                default=Value(1),
                output_field=IntegerField(),
            ),
            # Now we apply dynamic sorting based on the query parameters
            F(self.request.query_params.get('sort', 'date_requested')).asc() if self.request.query_params.get('direction', 'asc') == 'asc' else F(self.request.query_params.get('sort', 'date_requested')).desc()
        )

        return queryset

class WidgetAuthorizationRequestListView(generics.ListAPIView):
    """
    Returns authorization requests. If authorization requests are approved, also returns the link to download the document.
    Staff/Head are able to view all authorization requests here. Clients are only able to view their own requests.
    """

    http_method_names = ["get"]
    serializer_class = AuthorizationRequestSerializer
    pagination_class = PageNumberPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "client":
            queryset = AuthorizationRequest.objects.filter(requester=user)
        else:
            queryset = AuthorizationRequest.objects.all()
        return queryset

class AuthorizationRequestUpdateView(generics.UpdateAPIView):
    """
    Used by head approve or deny authorization requests.
    """

    http_method_names = ["patch"]
    serializer_class = AuthorizationRequestUpdateSerializer
    permission_classes = [IsAuthenticated, IsHead]
    queryset = AuthorizationRequest.objects.all()


class AuthorizationRequestUnitUpdateView(generics.UpdateAPIView):
    """
    Used by head approve or deny authorization request units.
    """

    http_method_names = ["patch"]
    serializer_class = AuthorizationRequestUnitUpdateSerializer
    permission_classes = [IsAuthenticated, IsHead]
    queryset = AuthorizationRequestUnit.objects.all()
