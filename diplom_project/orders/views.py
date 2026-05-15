from rest_framework import viewsets, permissions
from .serializers import OrderSerializer
from .services import get_orders_for_user, create_order, delete_order

# Create your views here.

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = get_orders_for_user(self.request.user)

        status_param = self.request.query_params.get('status')

        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset

    def perform_create(self, serializer):
        return create_order(self.request.user, 
        serializer.validated_data
        )

    def perform_update(self, serializer):
        return update_order(self.request.user, 
        self.get_object().id, 
        serializer.validated_data
        )

    def perform_destroy(self, instance):
        return delete_order(self.request.user, 
        instance.id
        )


