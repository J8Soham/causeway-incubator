/**
 * Firestore Seed Script using Firebase Client SDK
 *
 * Seeds curriculum data (courses, roles, subgoals, subsubgoals) into the
 * causeway-incubator-dev Firestore from structure.json.
 *
 * Usage:
 *   node scripts/seed-firestore.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Firebase config from environment.ts (dev project)
const firebaseConfig = {
    apiKey: process.env.NG_APP_FIREBASE_DEV_API_KEY || 'placeholder',
    authDomain: 'causeway-incubator-dev.firebaseapp.com',
    projectId: 'causeway-incubator-dev',
    storageBucket: 'causeway-incubator-dev.firebasestorage.app',
    messagingSenderId: '174824312685',
    appId: '1:174824312685:web:032c582afb1f76ccd4d464',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Only these 3 roles are active
const ACTIVE_ROLES = ['Components', 'Containers', 'Applications'];

const ROLE_METADATA = {
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

function inferStepType(name) {
    const lower = name.toLowerCase();
    if (lower.includes('quiz') || lower.includes('review') || lower.includes('assessment')) return 'review';
    if (lower.includes('adding') || lower.includes('create') || lower.includes('generate') ||
        lower.includes('define') || lower.includes('set ') || lower.includes('style') ||
        lower.includes('declare') || lower.includes('activate') || lower.includes('refactor') ||
        lower.includes('highlight') || lower.includes('assign') || lower.includes('merge') ||
        lower.includes('write') || lower.includes('build') || lower.includes('modify') ||
        lower.includes('batch')) return 'task';
    return 'concept';
}

async function seed() {
    console.log('🌱 Starting Firestore seed...\n');

    const structurePath = resolve(__dirname, '../.specify/memory/structure.json');
    const structureData = JSON.parse(readFileSync(structurePath, 'utf-8'));
    const now = Timestamp.now();
    const promises = [];

    // Course
    const courseId = 'web-dev-skill-building';
    promises.push(
        setDoc(doc(db, 'courses', courseId), {
            __id: courseId,
            title: 'Learn Web Development',
            subtitle: 'Using NgRx, Firebase, and Angular',
            description: 'This learning pathway teaches you web development through building Compass, a goal-setting app that helps you align short-term goals with long-term goals. Start from building UI Components, then learn to interact with the backend in Containers. We are working on additional roles related to defining the database schema and application routes.',
            order: 0,
            _createdAt: now,
            _updatedAt: now,
            _deleted: false,
        })
    );
    console.log(`📚 Course: ${courseId}`);

    let roleOrder = 0;
    for (const roleData of structureData.curriculum_tree) {
        if (!ACTIVE_ROLES.includes(roleData.role)) {
            console.log(`  ⏭️  Skipping: ${roleData.role}`);
            continue;
        }

        const roleName = roleData.role;
        const roleId = roleName.toLowerCase().replace(/\s+/g, '-');
        const meta = ROLE_METADATA[roleName];

        promises.push(
            setDoc(doc(db, 'roles', roleId), {
                __id: roleId,
                __courseId: courseId,
                name: roleName,
                icon: meta.icon,
                color: meta.color,
                description: meta.description,
                order: roleOrder++,
                _createdAt: now,
                _updatedAt: now,
                _deleted: false,
            })
        );
        console.log(`  🏷️  Role: ${roleName} (${roleId})`);

        for (let sgIdx = 0; sgIdx < roleData.features.length; sgIdx++) {
            const sgData = roleData.features[sgIdx];
            const sgId = `${roleId}--${sgData.subgoal.toLowerCase().replace(/\s+/g, '-')}`;

            promises.push(
                setDoc(doc(db, 'subgoals', sgId), {
                    __id: sgId,
                    __roleId: roleId,
                    name: sgData.subgoal,
                    order: sgIdx,
                    _createdAt: now,
                    _updatedAt: now,
                    _deleted: false,
                })
            );
            console.log(`    📂 Subgoal: ${sgData.subgoal}`);

            for (let ssgIdx = 0; ssgIdx < sgData.subsubgoals.length; ssgIdx++) {
                const stepName = sgData.subsubgoals[ssgIdx];
                const ssgId = `${sgId}--${ssgIdx}`;

                promises.push(
                    setDoc(doc(db, 'subsubgoals', ssgId), {
                        __id: ssgId,
                        __subgoalId: sgId,
                        name: stepName,
                        type: inferStepType(stepName),
                        order: ssgIdx,
                        _createdAt: now,
                        _updatedAt: now,
                        _deleted: false,
                    })
                );
                console.log(`      📝 ${stepName}`);
            }
        }
    }

    console.log(`\n⏳ Writing ${promises.length} documents...`);
    await Promise.all(promises);
    console.log('✅ All documents written!');

    const activeRoles = structureData.curriculum_tree.filter(r => ACTIVE_ROLES.includes(r.role));
    const subgoals = activeRoles.reduce((acc, r) => acc + r.features.length, 0);
    const steps = activeRoles.reduce((acc, r) => acc + r.features.reduce((a, f) => a + f.subsubgoals.length, 0), 0);
    console.log(`\n📊 Summary: 1 course, ${activeRoles.length} roles, ${subgoals} subgoals, ${steps} steps`);
}

seed()
    .then(() => { console.log('\n🎉 Seed complete!'); process.exit(0); })
    .catch((err) => { console.error('❌ Seed failed:', err); process.exit(1); });
