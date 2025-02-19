import React from 'react'


export default async function UniversityDetail({ params }: { params: Promise<{ uniId: string }> }) {
    const { uniId } = await params;
    console.log('uniId', uniId)
    return (
        <div>page</div>
    )
}
