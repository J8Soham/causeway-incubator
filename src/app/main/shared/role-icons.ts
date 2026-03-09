/**
 * Shared role icon mapping — maps role names to their hexagon SVG paths and colors.
 * Used across RoleSectionComponent, SidebarTocComponent, and RoleCoachComponent.
 */
export const ROLE_ICON_MAP: Record<string, { icon: string; color: string }> = {
    'Components': {
        icon: 'images/small-hexagon-block.svg',
        color: '#817FF1',
    },
    'Containers': {
        icon: 'images/medium-hexagon-block.svg',
        color: '#FFC43C',
    },
    'Applications': {
        icon: 'images/large-hexagon-block.svg',
        color: '#FF7991',
    },
};
