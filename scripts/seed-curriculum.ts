/**
 * Firestore Seed Script for Learning Main Page
 *
 * Reads structure.json and populates Firestore collections:
 * - courses
 * - roles (Components, Containers, Applications only)
 * - subgoals
 * - subsubgoals
 *
 * Usage:
 *   npx ts-node scripts/seed-curriculum.ts
 *
 * Prerequisites:
 *   - Firebase Admin SDK credentials (service account key)
 *   - Set GOOGLE_APPLICATION_CREDENTIALS env var to path of service account JSON
 */

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

// Role metadata: SVG icon paths and colors matching the hexagon block assets
const ROLE_METADATA: Record<string, { icon: string; color: string; description: string }> = {
    'Components': {
        icon: 'images/small-hexagon-block.svg',
        color: '#817FF1',
        description: 'Learn to build Angular components — the building blocks of your UI. Master elements, layout, data binding, and events.',
    },
    'Containers': {
        icon: 'images/medium-hexagon-block.svg',
        color: '#FFC43C',
        description: 'Learn to build smart containers that connect to the NgRx store and manage data flow between your UI and the database.',
    },
    'Applications': {
        icon: 'images/large-hexagon-block.svg',
        color: '#FF7991',
        description: 'Set up and structure a full Angular application with Firebase, routing, entity modeling, and component hierarchies.',
    },
};

// Only seed these 3 roles
const ACTIVE_ROLES = ['Components', 'Containers', 'Applications'];

// Default step type assignment based on name patterns
function inferStepType(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('quiz') || lower.includes('review') || lower.includes('assessment')) {
        return 'review';
    }
    if (
        lower.includes('adding') ||
        lower.includes('create') ||
        lower.includes('generate') ||
        lower.includes('define') ||
        lower.includes('set ') ||
        lower.includes('style') ||
        lower.includes('declare') ||
        lower.includes('activate') ||
        lower.includes('refactor') ||
        lower.includes('highlight') ||
        lower.includes('assign') ||
        lower.includes('merge') ||
        lower.includes('write') ||
        lower.includes('build') ||
        lower.includes('modify') ||
        lower.includes('batch')
    ) {
        return 'task';
    }
    return 'concept';
}

interface StructureJson {
    curriculum_tree: Array<{
        role: string;
        features: Array<{
            subgoal: string;
            subsubgoals: string[];
        }>;
    }>;
}

async function seed() {
    console.log('🌱 Starting Firestore seed...\n');

    // Read structure.json
    const structurePath = path.resolve(__dirname, '../.specify/memory/structure.json');
    const structureData: StructureJson = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));

    const batch = db.batch();
    let operationCount = 0;

    // Create course
    const courseId = 'web-dev-skill-building';
    const courseRef = db.collection('courses').doc(courseId);
    batch.set(courseRef, {
        __id: courseId,
        title: 'Learn Web Development',
        subtitle: 'Using NgRx, Firebase, and Angular',
        description: 'This learning pathway teaches you web development through building Compass, a goal-setting app that helps you align short-term goals with long-term goals. Start from building UI Components, then learn to interact with the backend in Containers. We are working on additional roles related to defining the database schema and application routes.',
        order: 0,
        _createdAt: admin.firestore.FieldValue.serverTimestamp(),
        _updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        _deleted: false,
    });
    operationCount++;
    console.log(`📚 Course: ${courseId}`);

    // Filter to active roles only and track order
    let roleOrder = 0;
    for (const roleData of structureData.curriculum_tree) {
        const roleName = roleData.role;

        // Skip non-active roles
        if (!ACTIVE_ROLES.includes(roleName)) {
            console.log(`  ⏭️  Skipping: ${roleName}`);
            continue;
        }

        const roleId = roleName.toLowerCase().replace(/\s+/g, '-');
        const metadata = ROLE_METADATA[roleName];

        const roleRef = db.collection('roles').doc(roleId);
        batch.set(roleRef, {
            __id: roleId,
            __courseId: courseId,
            name: roleName,
            icon: metadata.icon,
            color: metadata.color,
            description: metadata.description,
            order: roleOrder++,
            _createdAt: admin.firestore.FieldValue.serverTimestamp(),
            _updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            _deleted: false,
        });
        operationCount++;
        console.log(`  🏷️  Role: ${roleName} (${roleId})`);

        // Process each subgoal
        for (let sgIdx = 0; sgIdx < roleData.features.length; sgIdx++) {
            const sgData = roleData.features[sgIdx];
            const sgId = `${roleId}--${sgData.subgoal.toLowerCase().replace(/\s+/g, '-')}`;

            const sgRef = db.collection('subgoals').doc(sgId);
            batch.set(sgRef, {
                __id: sgId,
                __roleId: roleId,
                name: sgData.subgoal,
                order: sgIdx,
                _createdAt: admin.firestore.FieldValue.serverTimestamp(),
                _updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                _deleted: false,
            });
            operationCount++;
            console.log(`    📂 Subgoal: ${sgData.subgoal} (${sgId})`);

            // Process each subsubgoal (step)
            for (let ssgIdx = 0; ssgIdx < sgData.subsubgoals.length; ssgIdx++) {
                const stepName = sgData.subsubgoals[ssgIdx];
                const ssgId = `${sgId}--${ssgIdx}`;
                const stepType = inferStepType(stepName);

                const ssgRef = db.collection('subsubgoals').doc(ssgId);
                batch.set(ssgRef, {
                    __id: ssgId,
                    __subgoalId: sgId,
                    name: stepName,
                    type: stepType,
                    order: ssgIdx,
                    _createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    _updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    _deleted: false,
                });
                operationCount++;
                console.log(`      📝 Step: ${stepName} [${stepType}]`);
            }
        }
    }

    // Commit
    console.log(`\n⏳ Committing batch (${operationCount} operations)...`);
    await batch.commit();
    console.log('✅ Batch committed');
    console.log('\n🎉 Seed complete!');

    // Print summary
    const activeRoles = structureData.curriculum_tree.filter(r => ACTIVE_ROLES.includes(r.role));
    const subgoals = activeRoles.reduce((acc, r) => acc + r.features.length, 0);
    const steps = activeRoles.reduce(
        (acc, r) => acc + r.features.reduce((a, f) => a + f.subsubgoals.length, 0),
        0,
    );
    console.log(`\n📊 Summary: 1 course, ${activeRoles.length} roles, ${subgoals} subgoals, ${steps} steps`);
}

seed()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    });
