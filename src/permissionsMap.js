export default {
  permsCategory: [
    "category:create",
    "category:read",
    "category:update",
    "category:delete",
  ],
  permsEmployee: [
    "employee:create",
    "employee:read",
    "employee:update",
    "employee:delete",
  ],
  permsSchedule: [
    "schedule:create:owner",
    "schedule:read:owner",
    "schedule:update:owner",
    "schedule:delete:owner",
    "schedule:create:other",
    "schedule:read:other",
    "schedule:update:other",
    "schedule:delete:other",
  ],
  permsAppointment: [
    "appointment:create:owner",
    "appointment:read:owner",
    "appointment:update:owner",
    "appointment:delete:owner",
    "appointment:create:other",
    "appointment:read:other",
    "appointment:update:other",
    "appointment:delete:other",
  ],
  permsPermission: [
    "permission:read:other",
    "permission:update:other",
  ],
}
