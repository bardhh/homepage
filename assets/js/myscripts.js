// Google Analytics initialization
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("js", new Date());
gtag("config", "UA-53335203-1", {
  page_title: 'Homepage',
  page_location: window.location.href,
  send_page_view: false
});
gtag("event", "page_view", {
  page_title: 'Homepage',
  page_location: window.location.href
});

// Optimized GitHub API calls with caching and error handling
document.addEventListener('DOMContentLoaded', async () => {
  const elements = document.querySelectorAll('.github-star-count');
  const cache = new Map();

  // Batch process repos to avoid rate limiting
  const repos = Array.from(elements).map(el => el.dataset.repo).filter(Boolean);
  const uniqueRepos = [...new Set(repos)];

  for (const repo of uniqueRepos) {
    if (!repo.includes('/')) {
      console.warn('Invalid repo format:', repo);
      continue;
    }

    try {
      // Check cache first
      if (cache.has(repo)) {
        updateElements(repo, cache.get(repo));
        continue;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const res = await fetch(`https://api.github.com/repos/${repo}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const data = await res.json();
      const starCount = data.stargazers_count || 0;

      cache.set(repo, starCount);
      updateElements(repo, starCount);

      // Small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`Error fetching stars for ${repo}:`, error);
      updateElements(repo, 'N/A');
    }
  }

  function updateElements(repo, count) {
    elements.forEach(el => {
      if (el.dataset.repo === repo) {
        el.textContent = count;
      }
    });
  }
});

// Optimized script loading
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  if (callback) script.onload = callback;
  document.head.appendChild(script);
}

// Defer non-critical JavaScript
document.addEventListener('DOMContentLoaded', function () {
  // Load jQuery only when needed
  if (!window.jQuery) {
    loadScript('assets/js/jquery-3.5.1.min.js', initializeFiltering);
  } else {
    initializeFiltering();
  }
});

function initializeFiltering() {
  // Software filtering logic - optimized
  const softwareContainer = document.getElementById('software-list');
  const softwareCards = softwareContainer ? softwareContainer.querySelectorAll('.card') : [];
  const softwareButtons = document.querySelectorAll('.software-filters button');
  const softwareCounter = document.querySelector('.software-filter-count');

  function updateSoftwareCount() {
    if (!softwareCounter) return;
    const visible = Array.from(softwareCards).filter(card =>
      card.style.display !== 'none' && !card.hidden
    ).length;
    softwareCounter.textContent = `Showing ${visible} of ${softwareCards.length} tools`;
  }

  softwareButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      // Update active state
      softwareButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;

      // Show/hide cards efficiently
      softwareCards.forEach(card => {
        const shouldShow = filter === 'all' || card.classList.contains(filter);
        card.style.display = shouldShow ? 'block' : 'none';
      });

      updateSoftwareCount();
    });
  });

  // Initial count
  updateSoftwareCount();
}

// Footer date update
try {
  const dateModified = document.lastModified;
  const mydate = new Date(dateModified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const footerDiv = document.getElementById('footer');
  if (footerDiv) {
    footerDiv.textContent = "All Rights Reserved. Last Updated: " + mydate;
  }
} catch (e) {
  console.error("Could not parse lastModified date or find footer element");
  const footerDiv = document.getElementById('footer');
  if (footerDiv) {
    footerDiv.textContent = "All Rights Reserved.";
  }
}

// Global variables for publications data
let chartsInitialized = false;

function getTopicClasses(themeText) {
  if (!themeText) return 'topic-uncategorized';
  const lowerTheme = themeText.trim().toLowerCase();

  switch (lowerTheme) {
    case 'learning-based control and analysis':
      return 'topic-learning-control';
    case 'optimal planning and safe control':
      return 'topic-optimal-planning';
    case 'runtime verification and monitoring':
      return 'topic-runtime-verification';
    case 'testing, falsification, and specification':
      return 'topic-testing-falsification';
    case 'risk and stochasticity':
      return 'topic-risk-stochasticity';
    default:
      console.warn(`Unrecognized theme found in XML: "${themeText}"`);
      return 'topic-uncategorized';
  }
}

// Publication search functionality
function setupPublicationSearch() {
  const searchInput = document.getElementById('publicationSearch');
  const clearButton = document.getElementById('clearSearch');
  const searchResults = document.getElementById('searchResults');

  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase().trim();

    if (searchTerm.length === 0) {
      applyCurrentFilters();
      searchResults.style.display = 'none';
      clearButton.style.display = 'none';
    } else {
      clearButton.style.display = 'block';
      performSearch(searchTerm);
    }
  });

  clearButton.addEventListener('click', function () {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });
}

function performSearch(searchTerm) {
  const allCards = document.querySelectorAll('#pub-list .card');
  let visibleCount = 0;

  allCards.forEach(card => {
    const title = card.querySelector('.paper-title')?.textContent.toLowerCase() || '';
    const authors = card.querySelector('.paper-authors')?.textContent.toLowerCase() || '';
    const details = card.querySelector('.paper-details')?.textContent.toLowerCase() || '';

    const isMatch = title.includes(searchTerm) ||
      authors.includes(searchTerm) ||
      details.includes(searchTerm);

    if (isMatch) {
      card.style.display = 'block';
      visibleCount++;
      highlightSearchTerms(card, searchTerm);
    } else {
      card.style.display = 'none';
    }
  });

  const searchResults = document.getElementById('searchResults');
  const filterCount = document.querySelector('.filter-count');

  searchResults.textContent = `Search: ${visibleCount} results for "${searchTerm}"`;
  searchResults.style.display = 'block';
  filterCount.textContent = `Showing ${visibleCount} of ${allCards.length} publications`;
}

function highlightSearchTerms(card, searchTerm) {
  const elements = card.querySelectorAll('.paper-title, .paper-authors, .paper-details');
  elements.forEach(el => {
    let text = el.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlighted = text.replace(regex, '<mark>$1</mark>');
    if (highlighted !== text) {
      el.innerHTML = highlighted;
    }
  });
}

function applyCurrentFilters() {
  const activeFilter = document.querySelector('.pub-filters button.active');
  if (activeFilter) {
    activeFilter.click();
  }
}

// BibTeX Export functionality
function setupBibtexExport() {
  const exportBtn = document.getElementById('exportBibtex');
  if (!exportBtn) return;

  exportBtn.addEventListener('click', function () {
    const visibleCards = Array.from(document.querySelectorAll('#pub-list .card')).filter(card =>
      card.style.display !== 'none' && !card.hidden
    );

    if (visibleCards.length === 0) {
      alert('No publications to export. Please adjust your filters or search.');
      return;
    }

    let bibtexContent = '% BibTeX Export from Dr. Bardh Hoxha\'s Publications\n';
    bibtexContent += '% Generated on ' + new Date().toLocaleDateString() + '\n\n';

    visibleCards.forEach((card, index) => {
      const title = card.querySelector('.paper-title')?.textContent.trim() || 'Unknown Title';
      const authors = card.querySelector('.paper-authors')?.textContent.trim() || 'Unknown Authors';
      const details = card.querySelector('.paper-details')?.textContent.trim() || '';

      const yearMatch = details.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? yearMatch[0] : new Date().getFullYear();

      const firstAuthor = authors.split(',')[0].trim().replace(/\s+/g, '');
      const citationKey = `${firstAuthor}${year}${String.fromCharCode(97 + index)}`;

      const cardClasses = card.className;
      let entryType = 'article';
      if (cardClasses.includes('paper-conf')) entryType = 'inproceedings';
      else if (cardClasses.includes('paper-jour')) entryType = 'article';
      else if (cardClasses.includes('paper-work')) entryType = 'inproceedings';

      bibtexContent += `@${entryType}{${citationKey},\n`;
      bibtexContent += `  title={${title}},\n`;
      bibtexContent += `  author={${authors}},\n`;
      bibtexContent += `  year={${year}},\n`;

      if (details) {
        bibtexContent += `  note={${details}},\n`;
      }

      bibtexContent += '}\n\n';
    });

    const blob = new Blob([bibtexContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hoxha_publications_${new Date().toISOString().split('T')[0]}.bib`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fas fa-check-circle me-2"></i>Exported ${visibleCards.length} publications to BibTeX`;
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #198754; color: white; padding: 12px 20px; border-radius: 5px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  });
}

// jQuery document ready function
$(document).ready(function () {
  const pubListContainer = $("#pub-list");
  const filterButtons = $('.pub-filters button');
  const filterCountDisplay = $('.filter-count');

  pubListContainer.html(`
    <div class="text-center my-3">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading publications...</span>
        </div>
        <p class="mt-2 text-muted">Loading publications...</p>
    </div>`);

  setupPublicationSearch();
  setupBibtexExport();

  setTimeout(() => {
    setupMetricsCharts();
  }, 1000);

  filterButtons.on('click', function () {
    const $button = $(this);
    const filterValue = $button.data('filter');
    const isTopicButton = filterValue.startsWith('topic-');
    const isTypeButton = filterValue.startsWith('paper-') || filterValue === 'all';

    if (isTypeButton) {
      $('.pub-filters button[data-filter^="paper-"], .pub-filters button[data-filter="all"]').removeClass('active');
      if (filterValue !== 'recent') $button.addClass('active');
      else $('.pub-filters button[data-filter="all"]').addClass('active');
    } else if (isTopicButton) {
      $('.pub-filters button[data-filter^="topic-"]').removeClass('active');
      $button.addClass('active');
    }

    if (isTopicButton) {
      $('.pub-filters button[data-filter^="paper-"]').removeClass('active');
      $('.pub-filters button[data-filter="all"]').addClass('active');
    } else if (isTypeButton && filterValue !== 'all') {
      $('.pub-filters button[data-filter^="topic-"]').removeClass('active');
    } else if (filterValue === 'all') {
      $('.pub-filters button[data-filter^="topic-"]').removeClass('active');
    }

    const allCards = $('#pub-list .card');
    allCards.hide();

    const activeTypeFilter = $('.pub-filters button[data-filter^="paper-"].active, .pub-filters button[data-filter="all"].active').data('filter') || 'all';
    const activeTopicFilter = $('.pub-filters button[data-filter^="topic-"].active').data('filter');

    let selector = '#pub-list .card';

    if (activeTypeFilter !== 'all') {
      selector += '.' + activeTypeFilter;
    }

    if (activeTopicFilter) {
      selector += '.' + activeTopicFilter;
    }

    if (filterValue === 'recent') {
      $(selector).filter(function () {
        const details = $(this).find('.paper-details').text();
        return details.match(/(202\d|2030)/);
      }).show();
    } else {
      $(selector).show();
    }

    const visibleCount = $('#pub-list .card:visible').length;
    const totalCount = allCards.length;
    filterCountDisplay.text(`Showing ${visibleCount} of ${totalCount} publications`);
  });

  $.ajax({
    type: "GET",
    url: "./papers.xml",
    dataType: "xml",
    success: function (xml) {
      pubListContainer.empty();
      let totalLoadedCount = 0;
      $(xml)
        .find("paper")
        .each(function () {
          const $this = $(this);
          const paperType = $this.attr("type") || "other";
          const title = $this.find("title").text().trim();
          const authors = $this.find("authors").text().trim();
          const details = $this.find("other").text().trim();
          const pdfLink = $this.find("link").text().trim();
          const pdfTag = $this.find("tag").text().trim() || title.substring(0, 10);

          let combinedTopicClasses = new Set();
          $this.find("theme").each(function () {
            const themeText = $(this).text().trim();
            if (themeText) {
              const topicClass = getTopicClasses(themeText);
              if (topicClass && topicClass !== 'topic-uncategorized') {
                combinedTopicClasses.add(topicClass);
              } else if (topicClass === 'topic-uncategorized') {
                console.warn(`Paper "${title}" has an unrecognized or empty theme: "${themeText}"`);
              }
            }
          });

          const topicClasses = combinedTopicClasses.size > 0 ?
            Array.from(combinedTopicClasses).join(' ') :
            'topic-uncategorized';

          let links = '';
          if (pdfLink) {
            links += `<a href="${pdfLink}" target="_blank" rel="noopener" class="card-link" onClick="typeof ga === 'function' && ga('send', 'event', 'download', 'click', '${pdfTag}');"><i class="fas fa-file-pdf me-1"></i>PDF</a>`;
          }

          if ($this.find("techRep").length === 1 && $this.find("techRep").text().trim()) {
            links += ` <a href="${$this.find("techRep").text().trim()}" target="_blank" rel="noopener" class="card-link"><i class="fas fa-file-alt me-1"></i>TechRep</a>`;
          }
          if ($this.find("code").length === 1 && $this.find("code").text().trim()) {
            links += ` <a href ="${$this.find("code").text().trim()}" target="_blank" rel="noopener" class="card-link"><i class="fas fa-code me-1"></i>Code</a>`;
          }
          if ($this.find("video").length === 1 && $this.find("video").text().trim()) {
            links += ` <a href ="${$this.find("video").text().trim()}" target="_blank" rel="noopener" class="card-link"><i class="fas fa-video me-1"></i>Video</a>`;
          }
          if ($this.find("bibtex").length === 1 && $this.find("bibtex").text().trim()) {
            links += ` <a href ="${$this.find("bibtex").text().trim()}" target="_blank" rel="noopener" class="card-link"><i class="fas fa-quote-right me-1"></i>BibTeX</a>`;
          }

          let award = "";
          if ($this.find("award").length === 1 && $this.find("award").text().trim()) {
            award = `<p class="card-text text-success mt-2 mb-0"><small><i class="fas fa-star me-1"></i> ${$this.find("award").text().trim()}</small></p>`;
          }

          let typeBadgeText = '';
          switch (paperType) {
            case 'conf': typeBadgeText = 'Conference'; break;
            case 'jour': typeBadgeText = 'Journal'; break;
            case 'work': typeBadgeText = 'Workshop'; break;
            case 'other': typeBadgeText = 'Other'; break;
            default: typeBadgeText = paperType;
          }

          const cardHtml = `
            <div class="card mb-2 shadow-sm paper-${paperType} ${topicClasses}">
                <div class="card-body">
                    <h5 class="card-title paper-title mb-2">${title}</h5>
                    <h6 class="card-subtitle text-muted paper-authors">${authors}</h6>
                    <p class="card-text paper-details">${details}</p>
                    <div class="d-flex flex-wrap justify-content-between align-items-center mt-2">
                        <div class="paper-links">
                            ${links}
                        </div>
                        <span class="pub-type-badge pub-type-${paperType} badge ">
                            ${typeBadgeText}
                        </span>
                    </div>
                    ${award}
                </div>
            </div>`;

          pubListContainer.append(cardHtml);
          totalLoadedCount++;
        });

      const allCards = $('#pub-list .card');
      filterCountDisplay.text(`Showing ${totalLoadedCount} of ${totalLoadedCount} publications`);
      $('.pub-filters button[data-filter="all"]').trigger('click');

      allCards.each(function (index) {
        const card = $(this);
        card.css({
          'opacity': '0',
          'transform': 'translateY(20px)',
          'transition': 'opacity 0.5s ease, transform 0.5s ease'
        });

        setTimeout(function () {
          card.css({
            'opacity': '1',
            'transform': 'translateY(0)'
          });
        }, index * 50);
      });

      if (totalLoadedCount === 0) {
        pubListContainer.html('<p class="text-muted">No publications found or error loading the file.</p>');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error loading publications:", textStatus, errorThrown);
      pubListContainer.html('<div class="alert alert-danger" role="alert">Error loading publications. Please check the console or try again later.</div>');
      filterCountDisplay.text('');
    },
  });
});
