import { writable, type Writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'
import type { Prisma } from '@prisma/client'

type Organization = Prisma.OrganizationGetPayload<{
	include: {
		members: {
			where: {
				role: {
					equals: 'OWNER';
				}
			},
			include: {
				user: true
			}
		};
		applications: true;
		branding: true;
		
		owner: true;
		subscription: true;
	};
}>;

type LayoutOrganizations = Prisma.OrganizationGetPayload<{
    include: {
        applications: true,
		
    }
}>[]

export type LayoutApplication = Prisma.ApplicationGetPayload<{
	include: {
		redirect_urls: true;
		authentication_rule: true;
		app_role: {
			include: {
				app_role_assignment: true;
				assigned_permissions: true;
			}
		};
		branding: true;
		auth_request: true;
		permissions: true;
	};
}>;

type LoginApplication = Prisma.ApplicationGetPayload<{
    include: {
        redirect_urls: true,
        AuthRequest: true,
        app_role: true,
        branding: true,
    }
}>

export function setOrganizations(data: LayoutOrganizations) {
	const organizations = writable<LayoutOrganizations>(data)
	setContext('organizations', organizations)
}

export function setOrganization(data: Organization) {
	const organization = writable<Organization>(data)
	setContext('organization', organization)
}

export function setApplication(data: LayoutApplication | LoginApplication) {
	const applications = writable<LayoutApplication | LoginApplication | undefined>(data)
    setContext('application', applications)
}


export function getApplication() {
    return getContext<Writable<LayoutApplication>>('application')
}

export function getOrganizations() {
    return getContext<Writable<LayoutOrganizations>>('organizations')
}


export function getOrganization() {
    return getContext<Writable<Organization>>('organization')
}
