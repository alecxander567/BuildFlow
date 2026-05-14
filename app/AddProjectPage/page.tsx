import { Suspense } from "react";
import AddProjectPageContent from "./AddProjectPageContent";

export default function AddProjectPage() {
  return (
    <Suspense fallback={null}>
      <AddProjectPageContent />
    </Suspense>
  );
}
