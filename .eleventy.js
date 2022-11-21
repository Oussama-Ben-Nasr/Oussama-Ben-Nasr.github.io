const Image = require("@11ty/eleventy-img");
const { DateTime } = require('luxon');

module.exports = function (eleventyConfig) {
	// Copy the `css` directory to the output
	eleventyConfig.addPassthroughCopy('css');

	// Watch the `css` directory for changes
	eleventyConfig.addWatchTarget('css');

	eleventyConfig.addFilter('readableDate', (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
			'dd LLL yyyy'
		);
	});

	eleventyConfig.addNunjucksAsyncShortcode("myResponsiveImage", async function (src, alt) {
		    if (alt === undefined) {
			    throw new Error(`Missing \`alt\` on myResponsiveImage from: ${src}`);
			        }

		    let outputFormat = "png";
		    let stats = await Image(src, {
			            widths: [null],
			            formats: [outputFormat],
			            urlPath: "/images/",
			            outputDir: "_site/images/",
			            cacheOptions: {
					              duration: "1d",
					              directory: ".cache",
					              removeUrlQueryParams: false,
					            }
			          });
		    let lowestSrc = stats[outputFormat][0];
		let sizes = "100vw";
		return `<picture>
			      ${Object.values(stats).map(imageFormat => {
				            return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat.map(entry => `${entry.url} ${entry.width}w`).join(", ")}" sizes="${sizes}">`;
				          }).join("\n")}
		        <amp-img
			  class="is-rounded"
		          alt="${alt}"
		          src="${lowestSrc.url}"
		          width="${lowestSrc.width}"
		          height="${lowestSrc.height}">
			      </picture>`;
		  });
};
