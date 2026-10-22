// Staff member කෙනෙකුගේ data වල හැඩය
export type StaffStatus = "active" | "inactive";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  jobRole: string;
  department: string;
  systemRole: string;
  phone: string;
  joinedDate: string; // "YYYY-MM-DD" ආකාරයෙන්
  status: StaffStatus;
  lastLogin: string;
}

// "2020-02-10" -> "2020.02.10" (design එකේ පෙන්වන ආකාරය)
export function formatJoinedDate(iso: string): string {
  return iso.split("-").join(".");
}

// "Amal Udayanga" -> "AU"
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

// මේ මාසයේ join වුණාද කියා බලනවා
export function isJoinedThisMonth(iso: string, now: Date = new Date()): boolean {
  const [year, month] = iso.split("-").map(Number);
  return year === now.getFullYear() && month === now.getMonth() + 1;
}