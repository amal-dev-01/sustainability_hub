from rest_framework import serializers
from projects.models import Project, Contributor, Task
from accounts.models import User
from django.db import transaction

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class UserSimpleSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(validators=[])
    
    class Meta:
        model = User
        fields = ["id", "name", "email", "password"]


class ContributorSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer()

    class Meta:
        model = Contributor
        fields = ["id", "user", "skills", "joined_on", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]

    @transaction.atomic
    def create(self, validated_data):
        user_data = validated_data.pop("user", None)
        if not user_data:
            raise serializers.ValidationError({"user": "User data is required."})

        email = user_data.get("email")
        name = user_data.get("name")
        password = user_data.get("password")

        if not email or not password:
            raise serializers.ValidationError({"user": "Email and password are required."})
        
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "User with this email already exists."})
        user = User.objects.create_user(
            email=email,
            name=name,
            password=password
        )
        contributor = Contributor.objects.create(user=user, **validated_data)
        return contributor
    

    @transaction.atomic
    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)

        if user_data:
            user = instance.user
            email = user_data.get("email", user.email)
            name = user_data.get("name", user.name)
            password = user_data.get("password", None)
            if User.objects.exclude(pk=user.pk).filter(email=email).exists():
                raise serializers.ValidationError({"email": "This email is already in use."})
            user.name = name
            user.email = email
            if password:
                user.set_password(password)
            user.save()

        return super().update(instance, validated_data)



class TaskSerializer(serializers.ModelSerializer):
    project  =  ProjectSerializer(read_only = True)
    assigned_to = ContributorSerializer(many=True, read_only = True)

    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), source='project', write_only=True
    )

    assigned_to_ids = serializers.PrimaryKeyRelatedField(
        queryset=Contributor.objects.all(), many=True, source='assigned_to', write_only=True
    )

    class Meta:
        model = Task
        fields = [
            'id',
            'project',
            'project_id',
            'title',
            'description',
            'due_date',
            'is_completed',
            'assigned_to',
            'assigned_to_ids',
            'created_at',
            'updated_at',
        ]



