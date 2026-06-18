import type { Handle } from "@sveltejs/kit";

const LINK_PREVIEW_BOTS =
	/facebookexternalhit|Facebot|Twitterbot|Slackbot|Discordbot|TelegramBot|WhatsApp|LinkedInBot|SkypeUriPreview|vkShare|Pinterest|redditbot|Iframely|Embedly|Bitlybot|Linespider/i;

export const handle: Handle = async ({ event, resolve }) => {
	const useragent = event.request.headers.get("user-agent") ?? "";

	if (LINK_PREVIEW_BOTS.test(useragent)) {
		return new Response(null, { status: 404 });
	}

	return resolve(event);
};
