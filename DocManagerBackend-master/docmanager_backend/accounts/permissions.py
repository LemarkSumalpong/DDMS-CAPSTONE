from rest_framework.permissions import BasePermission


class IsStaff(BasePermission):
    """
    Allows access only to users with staff role
    """

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.role in (
                "head", "admin", "planning", "staff")
        )


class IsPlanning(BasePermission):
    """
    Allows access only to users with head, admin planning role
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.role in ("planning", "admin", "head", "staff"))


class IsHead(BasePermission):
    """
    Allows access only to users with staff role
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.role in ("head", "admin"))


class IsAdmin(BasePermission):
    """
    Allows access only to users with admin role
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.role == "admin")
