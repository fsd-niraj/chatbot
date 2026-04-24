export declare enum UserRole {
    MASTER_ADMIN = "MASTER_ADMIN",
    ORG_ADMIN = "ORG_ADMIN",
    ORG_MEMBER = "ORG_MEMBER"
}
export interface Organization {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
export interface User {
    id: string;
    orgId: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
    orgName: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    token: string;
    user: User;
    organization: Organization;
}
/** Shape stored in JWT payload */
export interface JWTPayload {
    userId: string;
    orgId: string;
    email: string;
    role: UserRole;
}
//# sourceMappingURL=auth.types.d.ts.map