from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated  # <--- WICHTIG
from django.contrib.auth.models import User  # <--- WICHTIG

from .models import Employee, Department, Position
from .serializers import EmployeeSerializer, DepartmentSerializer, PositionSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]


class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [
        IsAuthenticated
    ]  # Hier darf jetzt kein roter Kringel mehr sein

    # Diese Funktion wird automatisch aufgerufen, wenn du "Speichern" drückst
    def perform_create(self, serializer):
        # 1. Mitarbeiter speichern
        employee = serializer.save()

        # 2. Benutzernamen generieren (vorname.nachname)
        username = f"{employee.first_name}.{employee.last_name}".lower()

        # Umlaute ersetzen
        username = (
            username.replace("ä", "ae")
            .replace("ö", "oe")
            .replace("ü", "ue")
            .replace("ß", "ss")
        )

        # 3. Prüfen und User anlegen
        if not User.objects.filter(username=username).exists():
            print(f"Erstelle User: {username}")
            User.objects.create_user(
                username=username, email=employee.email, password="Start123!"
            )
        else:
            print(f"User {username} existiert bereits.")


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {"username": request.user.username, "email": request.user.email}
        )
