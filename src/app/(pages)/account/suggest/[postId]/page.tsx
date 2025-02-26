import React from "react";

async function page({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  console.log("postId", postId);
  return <div>page</div>;
}

export default page;
