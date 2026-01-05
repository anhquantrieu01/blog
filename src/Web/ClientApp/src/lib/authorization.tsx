import * as React from 'react';

import { useCurrentUser } from '../features/auth/api/getCurrentUser';
import { Navigate } from 'react-router-dom';
import { UserDto, CommentDto } from '../web-api-client';
export enum ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER',
}

export type RoleTypes = keyof typeof ROLES;

export const PasswordRules = {
  required: "Bắt buộc",
  minLength: {
    value: 6,
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  },
  validate: {
    hasUpper: (v?: string) =>
      /[A-Z]/.test(v ?? "") || "Phải có ít nhất 1 chữ hoa",
    hasLower: (v?: string) =>
      /[a-z]/.test(v ?? "") || "Phải có ít nhất 1 chữ thường",
    hasNumber: (v?: string) =>
      /\d/.test(v ?? "") || "Phải có ít nhất 1 số",
  },
};

export const POLICIES = {
  'comment:delete': (user: UserDto | null, comment: CommentDto) => {
    if (!user || !user.roles) return false;

    if (user.roles.includes(ROLES.ADMIN) || user.roles.includes(ROLES.MANAGER)) {
      return true;
    }

    if (
      user.roles.includes(ROLES.USER) &&
      comment.authorId === user.id
    ) {
      return true;
    }

    return false;
  },
};


export const useAuthorization = () => {
  const {data : user} = useCurrentUser();

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles?: RoleTypes[] }) => {
      if (!allowedRoles || allowedRoles.length === 0) return true;
      if (!user || !user.roles) return false;

      return user.roles.some(role =>
        allowedRoles.includes(role as RoleTypes)
      );
    },
    [user]
  );

  return {
    checkAccess,
    roles: user?.roles ?? [],
    user,
  };
};


type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & (
  | {
      allowedRoles: RoleTypes[];
      policyCheck?: never;
    }
  | {
      allowedRoles?: never;
      policyCheck: boolean;
    }
);

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = <Navigate to="/not-found" replace />,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  if (typeof policyCheck !== 'undefined') {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
