import algoliasearch from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import {
  configure,
  hits,
  pagination,
  panel,
  refinementList,
  searchBox,
  snippet
} from "instantsearch.js/es/widgets";

const searchClient = algoliasearch(
  "FXTVEKVP41",
  "28c4a57ccbd3711de5f755b9941a2e9e"
);

const search = instantsearch({
  indexName: "wp_wikisearchable_posts",
  searchClient,
  insights: true
});

search.addWidgets([
  searchBox({
    container: "#searchbox"
  }),
  hits({
    container: "#hits",
    templates: {
      item: (hit, { html, components }) => html`
        <article>
          <p>
            ${components.Highlight({ hit, attribute: "taxonomies.category" })}
          </p>
          <h2>
            <a href="${hit.permalink}"
              >${components.Highlight({ hit, attribute: "post_title" })}</a
            >
          </h2>
          <p>${components.Snippet({ attribute: "content", hit })}</p>
        </article>
      `
    },
    transformItems(items) {
      return items.map((item) => {
        const truncatedItem = item._highlightResult.content.value.substring(
          0,
          300
        );
        return {
          ...item,
          content: truncatedItem,
          _highlightResult: {
            ...item._highlightResult,
            content: {
              ...item._highlightResult.content,
              value: truncatedItem
            }
          }
        };
      });
    }
  }),
  configure({
    hitsPerPage: 10
  }),
  panel({
    templates: { header: "КАТЕГОРІЇ" }
  })(refinementList)({
    container: "#brand-list",
    attribute: "taxonomies.category"
  }),
  pagination({
    container: "#pagination"
  })
]);

search.start();
