import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { letters } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Helper function to get authenticated user
async function getAuthenticatedUser(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return null;
    }
    return session.user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// GET - List all letters or single letter by ID
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single letter by ID
    if (id) {
      const letterId = parseInt(id);
      if (isNaN(letterId)) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const letter = await db
        .select()
        .from(letters)
        .where(and(eq(letters.id, letterId), eq(letters.userId, user.id)))
        .limit(1);

      if (letter.length === 0) {
        return NextResponse.json(
          { error: 'Letter not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(letter[0], { status: 200 });
    }

    // List letters with pagination and search
    const limit = Math.min(
      parseInt(searchParams.get('limit') ?? '10'),
      100
    );
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    if (isNaN(limit) || limit < 0) {
      return NextResponse.json(
        { error: 'Invalid limit parameter', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: 'Invalid offset parameter', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    let query = db.select().from(letters).where(eq(letters.userId, user.id));

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        and(
          eq(letters.userId, user.id),
          or(
            like(letters.applicantName, searchTerm),
            like(letters.targetProgram, searchTerm),
            like(letters.targetInstitution, searchTerm),
            like(letters.fieldDomain, searchTerm)
          )
        )
      );
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

// POST - Create new letter
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = [
      'applicantName',
      'relationship',
      'durationKnown',
      'institution',
      'targetProgram',
      'targetInstitution',
      'fieldDomain',
      'observedQualities',
      'achievements',
      'softTraits',
      'referrerName',
      'referrerTitle',
      'referrerEmail',
      'tone',
      'lorType',
      'recommendationStrength',
    ];

    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(', ')}`,
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(body.referrerEmail)) {
      return NextResponse.json(
        {
          error: 'Invalid email format for referrerEmail',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      applicantName: body.applicantName.trim(),
      relationship: body.relationship.trim(),
      durationKnown: body.durationKnown.trim(),
      institution: body.institution.trim(),
      targetProgram: body.targetProgram.trim(),
      targetInstitution: body.targetInstitution.trim(),
      fieldDomain: body.fieldDomain.trim(),
      observedQualities: body.observedQualities.trim(),
      achievements: body.achievements.trim(),
      softTraits: body.softTraits.trim(),
      anecdote: body.anecdote ? body.anecdote.trim() : null,
      referrerName: body.referrerName.trim(),
      referrerTitle: body.referrerTitle.trim(),
      referrerEmail: body.referrerEmail.trim().toLowerCase(),
      tone: body.tone.trim(),
      lorType: body.lorType.trim(),
      recommendationStrength: body.recommendationStrength.trim(),
      content: body.content ? body.content.trim() : null,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newLetter = await db
      .insert(letters)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newLetter[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

// PUT - Update existing letter
export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const letterId = parseInt(id);
    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    // Check if letter exists and belongs to user
    const existingLetter = await db
      .select()
      .from(letters)
      .where(and(eq(letters.id, letterId), eq(letters.userId, user.id)))
      .limit(1);

    if (existingLetter.length === 0) {
      return NextResponse.json(
        { error: 'Letter not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate email if provided
    if (body.referrerEmail && !isValidEmail(body.referrerEmail)) {
      return NextResponse.json(
        {
          error: 'Invalid email format for referrerEmail',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // Sanitize string inputs
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (body.applicantName !== undefined)
      updates.applicantName = body.applicantName.trim();
    if (body.relationship !== undefined)
      updates.relationship = body.relationship.trim();
    if (body.durationKnown !== undefined)
      updates.durationKnown = body.durationKnown.trim();
    if (body.institution !== undefined)
      updates.institution = body.institution.trim();
    if (body.targetProgram !== undefined)
      updates.targetProgram = body.targetProgram.trim();
    if (body.targetInstitution !== undefined)
      updates.targetInstitution = body.targetInstitution.trim();
    if (body.fieldDomain !== undefined)
      updates.fieldDomain = body.fieldDomain.trim();
    if (body.observedQualities !== undefined)
      updates.observedQualities = body.observedQualities.trim();
    if (body.achievements !== undefined)
      updates.achievements = body.achievements.trim();
    if (body.softTraits !== undefined)
      updates.softTraits = body.softTraits.trim();
    if (body.anecdote !== undefined)
      updates.anecdote = body.anecdote ? body.anecdote.trim() : null;
    if (body.referrerName !== undefined)
      updates.referrerName = body.referrerName.trim();
    if (body.referrerTitle !== undefined)
      updates.referrerTitle = body.referrerTitle.trim();
    if (body.referrerEmail !== undefined)
      updates.referrerEmail = body.referrerEmail.trim().toLowerCase();
    if (body.tone !== undefined) updates.tone = body.tone.trim();
    if (body.lorType !== undefined) updates.lorType = body.lorType.trim();
    if (body.recommendationStrength !== undefined)
      updates.recommendationStrength = body.recommendationStrength.trim();
    if (body.content !== undefined)
      updates.content = body.content ? body.content.trim() : null;

    const updatedLetter = await db
      .update(letters)
      .set(updates)
      .where(and(eq(letters.id, letterId), eq(letters.userId, user.id)))
      .returning();

    if (updatedLetter.length === 0) {
      return NextResponse.json(
        { error: 'Letter not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedLetter[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete letter
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const letterId = parseInt(id);

    // Check if letter exists and belongs to user
    const existingLetter = await db
      .select()
      .from(letters)
      .where(and(eq(letters.id, letterId), eq(letters.userId, user.id)))
      .limit(1);

    if (existingLetter.length === 0) {
      return NextResponse.json(
        { error: 'Letter not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(letters)
      .where(and(eq(letters.id, letterId), eq(letters.userId, user.id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Letter not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Letter deleted successfully',
        id: letterId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}