"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export type TeamMember = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "owner" | "member";
  joinedAt: string; 
};

type UseTeamProps = {
  user: any;
  projects: any[];
  alertFns: {
    success: (msg: string) => void;
    error: (msg: string) => void;
  };
};

export function useTeam({ user, projects, alertFns }: UseTeamProps) {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [projectTeams, setProjectTeams] = useState<
    Record<string, TeamMember[]>
  >({});
  const [loading, setLoading] = useState(false);

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!user) return;
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const usersList = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setAllUsers(usersList);
      } catch (err) {
        console.error("Error fetching users:", err);
        alertFns.error("Failed to load users");
      }
    };
    fetchAllUsers();
  }, [user]);

  // Load team members for all projects
  useEffect(() => {
    const loadProjectTeams = async () => {
      if (!projects.length || !user || !allUsers.length) return;

      const teams: Record<string, TeamMember[]> = {};

      for (const project of projects) {
        try {
          const projectRef = doc(db, "projects", project.id);
          const projectDoc = await getDoc(projectRef);
          const projectData = projectDoc.data();

          if (
            projectData?.teamMembers &&
            Array.isArray(projectData.teamMembers)
          ) {
            teams[project.id] = projectData.teamMembers;
          } else {
            const owner = allUsers.find((u) => u.uid === project.userId);
            if (owner) {
              teams[project.id] = [
                {
                  uid: owner.uid,
                  email: owner.email || "",
                  displayName: owner.displayName || "Project Owner",
                  photoURL: owner.photoURL || "",
                  role: "owner",
                  joinedAt: new Date().toISOString(),
                },
              ];
              await updateDoc(projectRef, { teamMembers: teams[project.id] });
            }
          }
        } catch (err) {
          console.error(`Error loading team for project ${project.id}:`, err);
        }
      }

      setProjectTeams(teams);
    };

    loadProjectTeams();
  }, [projects, allUsers, user]);

  const addTeamMember = useCallback(
    async (projectId: string, member: any) => {
      if (!user) return;
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      if (project.userId !== user.uid) {
        alertFns.error("Only the project owner can add team members");
        return;
      }

      setLoading(true);
      try {
        const currentTeam = projectTeams[projectId] || [];
        const newMember: TeamMember = {
          uid: member.uid,
          email: member.email || "",
          displayName: member.displayName || "Anonymous User",
          photoURL: member.photoURL || "",
          role: "member",
          joinedAt: new Date().toISOString(),
        };

        const updatedTeam = [...currentTeam, newMember];
        await updateDoc(doc(db, "projects", projectId), {
          teamMembers: updatedTeam,
        });
        setProjectTeams((prev) => ({ ...prev, [projectId]: updatedTeam }));
        alertFns.success(`${newMember.displayName} added to team!`);
      } catch (err) {
        console.error("Error adding team member:", err);
        alertFns.error("Failed to add team member");
      } finally {
        setLoading(false);
      }
    },
    [user, projects, projectTeams, alertFns],
  );

  const removeTeamMember = useCallback(
    async (projectId: string, memberUid: string) => {
      if (!user) return;
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      if (project.userId !== user.uid) {
        alertFns.error("Only the project owner can remove team members");
        return;
      }

      const currentTeam = projectTeams[projectId] || [];
      const memberToRemove = currentTeam.find((m) => m.uid === memberUid);
      if (!memberToRemove || memberToRemove.role === "owner") {
        alertFns.error("Cannot remove project owner");
        return;
      }

      setLoading(true);
      try {
        const updatedTeam = currentTeam.filter((m) => m.uid !== memberUid);
        await updateDoc(doc(db, "projects", projectId), {
          teamMembers: updatedTeam,
        });
        setProjectTeams((prev) => ({ ...prev, [projectId]: updatedTeam }));
        alertFns.success("Team member removed");
      } catch (err) {
        console.error("Error removing team member:", err);
        alertFns.error("Failed to remove team member");
      } finally {
        setLoading(false);
      }
    },
    [user, projects, projectTeams, alertFns],
  );

  const getAvailableUsers = useCallback(
    (projectId: string, searchTerm: string) => {
      const currentTeam = projectTeams[projectId] || [];
      const currentMemberUids = currentTeam.map((m) => m.uid);

      let available = allUsers.filter(
        (u) => !currentMemberUids.includes(u.uid) && u.uid !== user?.uid,
      );

      if (searchTerm) {
        available = available.filter(
          (u) =>
            u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      return available;
    },
    [allUsers, projectTeams, user],
  );

  const isProjectOwner = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      return project?.userId === user?.uid;
    },
    [projects, user],
  );

  const getTeamForProject = useCallback(
    (projectId: string) => projectTeams[projectId] || [],
    [projectTeams],
  );

  return {
    allUsers,
    projectTeams,
    loading,
    addTeamMember,
    removeTeamMember,
    getAvailableUsers,
    isProjectOwner,
    getTeamForProject,
  };
}
