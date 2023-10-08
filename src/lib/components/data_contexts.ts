import { writable, type Writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'
import type { Prisma } from '@prisma/client'

type Organization = Prisma.OrganizationGetPayload<{
	include: {
		members: true;
		applications: true;
		branding: true;
		AuthRequest: {
			take: 10;
		};
		owner: true;
		subscription: true;
	};
}>;

type LayoutOrganizations = Prisma.OrganizationGetPayload<{
    include: {
        applications: true,
		
    }
}>[]

type Application = Prisma.ApplicationGetPayload<{
	include: {
		redirect_urls: true;
		authentication_rule: true;
		app_role: true;
		branding: true;
		auth_request: true
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

export function setApplication(data: Application | LoginApplication) {
	const applications = writable<Application | LoginApplication | undefined>(data)
    setContext('application', applications)
}

export function getOrganizations() {
    return getContext<Writable<LayoutOrganizations>>('organizations')
}


export function getOrganization() {
    return getContext<Writable<Organization>>('organization')
}

export function getApplication() {
    return getContext<Writable<Application>>('application')
}