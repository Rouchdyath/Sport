import re

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class StrongPasswordValidator:
    def __call__(self, value):
        if len(value) < 6:
            raise DjangoValidationError("Le mot de passe doit contenir au moins 6 caractères.")
        if not re.search(r"[A-Z]", value):
            raise DjangoValidationError("Le mot de passe doit contenir au moins une lettre majuscule.")
        if not re.search(r"[a-z]", value):
            raise DjangoValidationError("Le mot de passe doit contenir au moins une lettre minuscule.")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise DjangoValidationError("Le mot de passe doit contenir au moins un caractère spécial.")


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username = serializers.CharField(required=False, allow_blank=True, write_only=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].required = False
        self.fields["username"].allow_blank = True

    def validate(self, attrs):
        email = (attrs.get("email") or "").strip()
        password = attrs.get("password")

        if not email:
            raise serializers.ValidationError({"email": ["Ce champ est obligatoire."]})
        if not password:
            raise serializers.ValidationError({"password": ["Ce champ est obligatoire."]})

        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            raise serializers.ValidationError({"email": ["Aucun compte trouvé avec cet email."]})

        attrs["username"] = user.username
        return super().validate(attrs)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password, StrongPasswordValidator()],
    )
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "password2", "first_name", "last_name"]

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return data

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "is_staff"]