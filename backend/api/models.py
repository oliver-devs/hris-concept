from django.db import models
from django.contrib.auth.models import (
    Group,
)


# 1. Das neue Modell für Job-Titel
class Position(models.Model):
    title = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    # Verknüpfung zur technischen Rechte-Gruppe
    group = models.ForeignKey(Group, on_delete=models.PROTECT)

    def __str__(self):
        return self.title


# 2. Bestehendes Modell (unverändert)
class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


# 3. Mitarbeiter erweitert um Position
class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.ForeignKey(
        Department, on_delete=models.CASCADE, related_name="employees"
    )
    position = models.ForeignKey(
        Position, on_delete=models.SET_NULL, null=True, blank=True
    )

    # HIER NEU: Der Freigabe-Schalter
    is_approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
