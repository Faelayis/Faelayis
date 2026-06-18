<script lang="ts">
	import Nav from "$components/Nav.svelte";
	import Hero from "$components/Hero.svelte";
	import PartOfWork from "$components/PartOfWork.svelte";
	import SideProjects from "$components/SideProjects.svelte";
	import TechSkills from "$components/TechSkills.svelte";
	import About from "$components/About.svelte";
	import Contact from "$components/Contact.svelte";
	import Footer from "$components/Footer.svelte";
	import ScrollProgress from "$components/ScrollProgress.svelte";
	import SectionIndex from "$components/SectionIndex.svelte";
	import YearBadge from "$components/YearBadge.svelte";

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.personalInfo.name}</title>
</svelte:head>

<ScrollProgress />
<Nav />
<SectionIndex />
<YearBadge />

<main>
	<Hero
		name={data.personalInfo.name}
		handle={data.personalInfo.handle}
		role={data.personalInfo.role}
		location={data.personalInfo.location}
		bio={data.personalInfo.bio}
	/>
	<PartOfWork partOfWork={data.partOfWork} />
	<SideProjects
		sideProjects={data.sideProjects}
		error={data.sideProjectsError}
		githubUsername={data.username}
		projectsConfig={data.projectsConfig}
	/>
	<TechSkills />
	<About role={data.personalInfo.role} location={data.personalInfo.location} longBio={data.personalInfo.longBio} />
	<Contact email={data.personalInfo.email} socials={data.personalInfo.socials} />
</main>

<Footer name={data.personalInfo.name} />

<style>
	:global(.ulink) {
		border-bottom: 1px solid var(--line-strong);
		transition:
			color var(--duration-fast) var(--easing-soft),
			border-color var(--duration-fast) var(--easing-soft);
	}
	:global(.ulink:hover) {
		color: var(--accent);
		border-color: var(--accent);
	}
</style>
