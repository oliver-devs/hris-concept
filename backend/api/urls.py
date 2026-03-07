from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from .views import (
    AbsenceViewSet,
    ChangePasswordView,
    CurrentUserView,
    DepartmentViewSet,
    EmployeeViewSet,
    PositionViewSet,
    TimeEntryViewSet,
)

router = DefaultRouter()
router.register(r"employees", EmployeeViewSet)
router.register(r"departments", DepartmentViewSet)
router.register(r"positions", PositionViewSet, basename="position")
router.register(r"absences", AbsenceViewSet)
router.register(r"time-entries", TimeEntryViewSet, basename="timeentry")

urlpatterns = [
    path("login/", obtain_auth_token, name="login"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("", include(router.urls)),
]
