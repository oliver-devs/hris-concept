from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, DepartmentViewSet, PositionViewSet
from rest_framework.authtoken.views import obtain_auth_token  # <--- IMPORTIEREN

router = DefaultRouter()
router.register(r"employees", EmployeeViewSet)
router.register(r"departments", DepartmentViewSet)
router.register(r"positions", PositionViewSet)

urlpatterns = [
    path("login/", obtain_auth_token),  # <--- DIE LOGIN URL
    path("", include(router.urls)),
]
