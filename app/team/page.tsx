"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/hooks/useAuth";
import { useProjects } from "@/app/hooks/useProject";
import { useAlert, AlertContainer } from "@/app/components/Alert";
import Sidebar from "@/app/components/Sidebar";
import TopBar from "@/app/components/Topbar";
import { useTeam, type TeamMember } from "@/app/hooks/useTeam";

function Avatar({
  photoURL,
  displayName,
  size = 40,
  gradient = "from-blue-500 to-purple-600",
}: {
  photoURL?: string;
  displayName: string;
  size?: number;
  gradient?: string;
}) {
  if (photoURL) {
    return (
      <Image
        src={photoURL}
        alt={displayName}
        width={size}
        height={size}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {displayName.charAt(0).toUpperCase()}
    </div>
  );
}

function RoleBadge({ role }: { role: "owner" | "member" }) {
  if (role === "owner") {
    return (
      <span className="ml-2 text-[10px] font-semibold bg-[#FEF0E7] text-[#E8610A] px-2 py-0.5 rounded-full border border-[#F5C9A9]">
        Owner
      </span>
    );
  }
  return (
    <span className="ml-2 text-[10px] font-semibold bg-[#EEF2FF] text-[#4F46E5] px-2 py-0.5 rounded-full border border-[#C7D2FE]">
      Member
    </span>
  );
}

function YouBadge() {
  return (
    <span className="ml-2 text-[10px] font-semibold bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
      You
    </span>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF0E7]">
        {icon}
      </div>
      <h3
        className="mb-1 text-sm font-semibold text-[#1A1916]"
        style={{ fontFamily: "'Sora', sans-serif" }}>
        {title}
      </h3>
      <p className="mb-4 max-w-xs text-xs leading-relaxed text-[#B0ADA7]">
        {description}
      </p>
      {action}
    </div>
  );
}

function EmailText({ email }: { email?: string }) {
  if (email) {
    return <p className="text-xs text-[#B0ADA7] truncate">{email}</p>;
  }
  return (
    <p className="text-xs text-[#D6D1CA] italic truncate">
      Email not available — user must log in once
    </p>
  );
}

function TeamMemberRow({
  member,
  currentUserId,
  isOwner,
  onRemove,
  removing,
}: {
  member: TeamMember;
  currentUserId?: string;
  isOwner: boolean;
  onRemove: (uid: string) => void;
  removing: boolean;
}) {
  const isYou = member.uid === currentUserId;
  const canRemove = isOwner && member.role !== "owner" && !isYou;

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-[#EDE8E2] hover:border-[#D6D1CA] hover:shadow-sm transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar
          photoURL={member.photoURL}
          displayName={member.displayName}
          size={38}
        />
        <div className="min-w-0">
          <div className="flex items-center flex-wrap gap-0.5">
            <span className="text-sm font-semibold text-[#1A1916] truncate">
              {member.displayName}
            </span>
            {isYou && <YouBadge />}
            <RoleBadge role={member.role} />
          </div>
          <EmailText email={member.email} />
        </div>
      </div>
      {canRemove && (
        <button
          onClick={() => onRemove(member.uid)}
          disabled={removing}
          className="ml-3 flex-shrink-0 text-xs font-medium text-[#C0392B] hover:text-white hover:bg-[#C0392B] border border-[#F5C6C6] hover:border-[#C0392B] px-3 py-1.5 rounded-lg transition-all disabled:opacity-50">
          Remove
        </button>
      )}
    </div>
  );
}

function AvailableUserRow({
  availableUser,
  onAdd,
  adding,
}: {
  availableUser: any;
  onAdd: (user: any) => void;
  adding: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-[#EDE8E2] hover:border-[#D6D1CA] hover:shadow-sm transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar
          photoURL={availableUser.photoURL}
          displayName={availableUser.displayName || "U"}
          size={38}
          gradient="from-teal-500 to-emerald-600"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1A1916] truncate">
            {availableUser.displayName || "Anonymous User"}
          </p>
          <EmailText email={availableUser.email} />
          {availableUser.bio && (
            <p className="text-xs text-[#D6D1CA] mt-0.5 truncate">
              {availableUser.bio.substring(0, 50)}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => onAdd(availableUser)}
        disabled={adding}
        className="ml-3 flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-white bg-[#E8610A] hover:bg-[#D15508] active:scale-[0.97] px-3 py-1.5 rounded-lg transition-all disabled:opacity-50">
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add
      </button>
    </div>
  );
}

function ProjectOverviewCard({
  project,
  teamMembers,
  currentUserId,
  onClick,
}: {
  project: any;
  teamMembers: TeamMember[];
  currentUserId?: string;
  onClick: () => void;
}) {
  const isOwner = project.userId === currentUserId;
  const preview = teamMembers.slice(0, 4);
  const overflow = teamMembers.length - preview.length;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-[#EDE8E2] p-4 cursor-pointer hover:shadow-md hover:border-[#D6D1CA] transition-all group">
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0">
          <h3
            className="font-semibold text-sm text-[#1A1916] group-hover:text-[#E8610A] transition-colors truncate"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            {project.title}
          </h3>
          {/* ✅ Show correct role label */}
          <span className="text-[10px] font-semibold text-[#E8610A]">
            {isOwner ? "Owner" : "Member"}
          </span>
        </div>
        <svg
          className="w-4 h-4 text-[#B0ADA7] group-hover:text-[#E8610A] transition-colors flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      <p className="text-xs text-[#B0ADA7] mb-4 line-clamp-2 leading-relaxed">
        {project.description || "No description"}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {preview.map((member) => (
            <div
              key={member.uid}
              title={member.displayName}
              className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E8610A] to-[#F5A623] border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
              {member.displayName.charAt(0).toUpperCase()}
            </div>
          ))}
          {overflow > 0 && (
            <div className="w-7 h-7 rounded-full bg-[#F2EDE7] border-2 border-white flex items-center justify-center text-[#72706A] text-[10px] font-bold">
              +{overflow}
            </div>
          )}
        </div>
        <span className="text-xs text-[#B0ADA7]">
          {teamMembers.length} {teamMembers.length === 1 ? "member" : "members"}
        </span>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 px-1 text-xs font-semibold transition-all border-b-2 ${
        active ?
          "border-[#E8610A] text-[#E8610A]"
        : "border-transparent text-[#72706A] hover:text-[#1A1916]"
      }`}>
      {children}
    </button>
  );
}

export default function TeamPage() {
  const { user, authLoading } = useAuth();

  // Get ALL projects from hook (same as Projects page)
  const { projects: allProjects, loading: projectsLoading } = useProjects(
    user,
    authLoading,
  );

  const { toasts, remove, success, error } = useAlert();

  const {
    loading,
    addTeamMember,
    removeTeamMember,
    getAvailableUsers,
    isProjectOwner,
    getTeamForProject,
    projectTeams,
  } = useTeam({ user, projects: allProjects, alertFns: { success, error } });

  // Filter to only projects the user owns OR is a member of
  const projects = allProjects.filter((p) => {
    if (p.userId === user?.uid) return true; // user is owner
    // Check teamMembers stored on the project document (available immediately)
    const members = (p.teamMembers ?? []) as TeamMember[];
    return members.some((m) => m.uid === user?.uid);
  });

  const [selectedProject, setSelectedProject] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"team" | "available">("team");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectProject = (id: string) => {
    setSelectedProject(id);
    setActiveTab("team");
    setSearchTerm("");
  };

  const handleAddMember = async (member: any) => {
    await addTeamMember(selectedProject, member);
    setActiveTab("team");
    setSearchTerm("");
  };

  const handleRemoveMember = (uid: string) => {
    removeTeamMember(selectedProject, uid);
  };

  const isLoading = authLoading || projectsLoading;
  const currentTeam = getTeamForProject(selectedProject);
  const availableUsers = getAvailableUsers(selectedProject, searchTerm);
  const ownerOfSelected = isProjectOwner(selectedProject);

  if (isLoading) {
    return (
      <div
        className="flex h-screen overflow-hidden bg-[#F9F7F4]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#E8610A] border-t-transparent" />
              <p className="mt-2 text-sm text-[#72706A]">Loading teams…</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-[#F9F7F4]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="text-center">
          <h2
            className="text-xl font-semibold text-[#1A1916] mb-1"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            Please log in
          </h2>
          <p className="text-sm text-[#72706A]">
            You need to be logged in to manage teams.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AlertContainer toasts={toasts} onRemove={remove} position="top-right" />

      <div
        className="flex h-screen overflow-hidden bg-[#F9F7F4]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
          <TopBar />

          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
            <div className="mx-auto max-w-6xl flex flex-col gap-5 md:gap-7">
              {/* ── Page Header ── */}
              <div>
                <h1
                  className="text-lg font-bold text-[#1A1916] sm:text-xl"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  Team Management
                </h1>
                <p className="text-xs text-[#B0ADA7] mt-0.5">
                  Manage collaborators across your projects
                </p>
              </div>

              {/* ── Project Selector ── */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="text-xs font-semibold text-[#72706A] shrink-0">
                  Project
                </label>
                <div className="relative w-full sm:w-80">
                  <select
                    value={selectedProject}
                    onChange={(e) => handleSelectProject(e.target.value)}
                    className="w-full appearance-none bg-white border border-[#EDE8E2] text-[#1A1916] text-sm rounded-xl px-4 py-2.5 pr-9 focus:outline-none focus:ring-2 focus:ring-[#E8610A]/30 focus:border-[#E8610A] transition-all cursor-pointer">
                    <option value="">Choose a project…</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                        {project.userId === user.uid ? " (Owner)" : " (Member)"}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0ADA7]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* ── Selected Project Panel ── */}
              {selectedProject ?
                <div className="bg-white rounded-2xl border border-[#EDE8E2] overflow-hidden">
                  {/* Only owners see the Add Members tab */}
                  {ownerOfSelected && (
                    <div className="flex gap-6 px-6 pt-4 border-b border-[#EDE8E2]">
                      <TabButton
                        active={activeTab === "team"}
                        onClick={() => {
                          setActiveTab("team");
                          setSearchTerm("");
                        }}>
                        Team · {currentTeam.length}
                      </TabButton>
                      <TabButton
                        active={activeTab === "available"}
                        onClick={() => setActiveTab("available")}>
                        Add Members ·{" "}
                        {getAvailableUsers(selectedProject, "").length}
                      </TabButton>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Team Tab */}
                    {activeTab === "team" && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h2
                              className="text-sm font-bold text-[#1A1916]"
                              style={{ fontFamily: "'Sora', sans-serif" }}>
                              Current Team
                            </h2>
                            {/* Correct subtitle based on role */}
                            {!ownerOfSelected && (
                              <p className="text-xs text-[#B0ADA7] mt-0.5">
                                You're a member of this team
                              </p>
                            )}
                          </div>
                          {ownerOfSelected && (
                            <button
                              onClick={() => setActiveTab("available")}
                              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#E8610A] hover:bg-[#D15508] active:scale-[0.97] px-3 py-2 rounded-xl transition-all">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              Add Members
                            </button>
                          )}
                        </div>

                        {currentTeam.length === 0 ?
                          <EmptyState
                            icon={
                              <svg
                                className="w-6 h-6 text-[#E8610A]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.75}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            }
                            title="No team members yet"
                            description="Add members to start collaborating on this project."
                            action={
                              ownerOfSelected ?
                                <button
                                  onClick={() => setActiveTab("available")}
                                  className="text-xs font-semibold text-[#E8610A] hover:underline">
                                  Browse users →
                                </button>
                              : undefined
                            }
                          />
                        : <div className="flex flex-col gap-2">
                            {currentTeam.map((member) => (
                              <TeamMemberRow
                                key={member.uid}
                                member={member}
                                currentUserId={user.uid}
                                isOwner={ownerOfSelected}
                                onRemove={handleRemoveMember}
                                removing={loading}
                              />
                            ))}
                          </div>
                        }
                      </>
                    )}

                    {/* Available Users Tab — owners only */}
                    {activeTab === "available" && ownerOfSelected && (
                      <>
                        <div className="mb-4">
                          <h2
                            className="text-sm font-bold text-[#1A1916] mb-1"
                            style={{ fontFamily: "'Sora', sans-serif" }}>
                            Available Users
                          </h2>
                          <p className="text-xs text-[#B0ADA7] mb-3">
                            Browse all users and add them to your project team
                          </p>
                          <div className="relative">
                            <svg
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0ADA7]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                            <input
                              type="text"
                              placeholder="Search by name or email…"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 bg-[#F9F7F4] border border-[#EDE8E2] rounded-xl text-sm text-[#1A1916] placeholder:text-[#B0ADA7] focus:outline-none focus:ring-2 focus:ring-[#E8610A]/30 focus:border-[#E8610A] transition-all"
                            />
                          </div>
                        </div>

                        {availableUsers.length === 0 ?
                          <EmptyState
                            icon={
                              <svg
                                className="w-6 h-6 text-[#E8610A]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.75}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                            }
                            title={
                              searchTerm ? "No users found" : "All users added"
                            }
                            description={
                              searchTerm ?
                                "Try a different name or email address."
                              : "All available users are already on this team."
                            }
                            action={
                              searchTerm ?
                                <button
                                  onClick={() => setSearchTerm("")}
                                  className="text-xs font-semibold text-[#E8610A] hover:underline">
                                  Clear search
                                </button>
                              : undefined
                            }
                          />
                        : <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                            {availableUsers.map((u) => (
                              <AvailableUserRow
                                key={u.uid}
                                availableUser={u}
                                onAdd={handleAddMember}
                                adding={loading}
                              />
                            ))}
                          </div>
                        }
                      </>
                    )}
                  </div>
                </div>
              : projects.length > 0 ?
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h2
                      className="text-base font-bold text-[#1A1916]"
                      style={{ fontFamily: "'Sora', sans-serif" }}>
                      Your Project Teams
                    </h2>
                    <p className="text-xs text-[#B0ADA7]">
                      {projects.length} project
                      {projects.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                      <ProjectOverviewCard
                        key={project.id}
                        project={project}
                        teamMembers={projectTeams[project.id] || []}
                        currentUserId={user.uid}
                        onClick={() => handleSelectProject(project.id)}
                      />
                    ))}
                  </div>
                </div>
              : <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6D1CA] bg-white py-16 px-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF0E7]">
                    <svg
                      className="w-6 h-6 text-[#E8610A]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="mb-1 text-sm font-semibold text-[#1A1916]"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    No projects yet
                  </h3>
                  <p className="text-xs leading-relaxed text-[#B0ADA7]">
                    Create a project first, or get added to one as a team
                    member.
                  </p>
                </div>
              }
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
