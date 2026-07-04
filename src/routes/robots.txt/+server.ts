export function GET() {
	const allowRobots = import.meta.env.VITE_ALLOW_ROBOTS === 'true';
	const body = allowRobots
		? '# https://www.robotstxt.org/robotstxt.html\nUser-agent: *\nDisallow:\n'
		: '# https://www.robotstxt.org/robotstxt.html\nUser-agent: *\nDisallow: /\n';

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain'
		}
	});
}
