import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ message: '비밀번호 틀림' }, { status: 401 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, now: Date.now() });
}
