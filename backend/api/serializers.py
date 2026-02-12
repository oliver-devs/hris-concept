from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import Department, Employee, Position


# 1. Serializer für die Position
class PositionSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source="group.name", read_only=True)

    class Meta:
        model = Position
        fields = ["id", "title", "description", "group", "group_name"]


# 2. Serializer für Department (bleibt gleich, nur Imports checken)
class DepartmentSerializer(serializers.ModelSerializer):
    employee_count = serializers.IntegerField(source="employees.count", read_only=True)

    class Meta:
        model = Department
        fields = ["id", "name", "description", "employee_count"]


# 3. Serializer für Employee (mit Position)
class EmployeeSerializer(serializers.ModelSerializer):
    department = serializers.SlugRelatedField(
        queryset=Department.objects.all(), slug_field="name"
    )
    position = serializers.SlugRelatedField(
        queryset=Position.objects.all(), slug_field="title", allow_null=True
    )

    class Meta:
        model = Employee
        fields = "__all__"
