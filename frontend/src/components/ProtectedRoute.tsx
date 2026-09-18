import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  element: React.JSX.Element;
  allowedRoleIds: string[];
  userRoleId: string;
  isLoading: boolean;
};

const ProtectedRoute = ({
  element,
  allowedRoleIds,
  userRoleId,
  isLoading,
}: ProtectedRouteProps) => {
  if (isLoading) {
    return null;
  }

  if (!userRoleId) {
    return <Navigate to="/" />;
  }

  return allowedRoleIds.includes(userRoleId) ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
