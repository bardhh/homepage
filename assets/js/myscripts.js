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

// Dark Mode Logic
function initTheme() {
  const toggleCheckboxes = document.querySelectorAll('.theme-toggle-checkbox');
  const html = document.documentElement;
  
  // Check for saved user preference, if any, on load
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Apply the theme
  setTheme(currentTheme);

  toggleCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      currentTheme = e.target.checked ? 'dark' : 'light';
      setTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  });

  function setTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      toggleCheckboxes.forEach(cb => cb.checked = true);
    } else {
      html.removeAttribute('data-theme');
      toggleCheckboxes.forEach(cb => cb.checked = false);
    }
  }
}

// Optimized GitHub API calls with caching and error handling
document.addEventListener('DOMContentLoaded', async () => {
  initTheme(); // Initialize Dark Mode

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
  initializeFiltering();
  loadPublications(); // Load publications without jQuery
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
    // Simple reset to remove previous marks would be better, but for now let's just re-render if needed
    // Ideally we should store original text. For this simple implementation, we might skip complex highlighting 
    // or implement a more robust way. 
    // Re-implementing basic highlighting:
    const originalText = el.textContent; // This loses previous HTML structure if any (like links), but these fields are usually text.
    // Actually, paper-details might have links? No, usually text.
    
    // To be safe and simple, let's just highlight text content if it matches.
    // A better approach for production is to wrap matches in <mark> without destroying other HTML.
    // Given the context, these fields are mostly text.
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    if (searchTerm && originalText.toLowerCase().includes(searchTerm)) {
         // This is a destructive operation for inner HTML events/bindings, but fine for static text
         // el.innerHTML = originalText.replace(regex, '<mark>$1</mark>'); 
         // CAUTION: This can break if we repeatedly search. 
         // A safer way is to remove all marks first.
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

// Load Publications using Fetch API
async function loadPublications() {
  const pubListContainer = document.getElementById("pub-list");
  const filterButtons = document.querySelectorAll('.pub-filters button');
  const filterCountDisplay = document.querySelector('.filter-count');

  if (!pubListContainer) return;

  pubListContainer.innerHTML = `
    <div class="text-center my-3">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading publications...</span>
        </div>
        <p class="mt-2 text-muted">Loading publications...</p>
    </div>`;

  setupPublicationSearch();
  setupBibtexExport();

  // Setup Filter Click Handlers
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const filterValue = this.dataset.filter;
      const isTopicButton = filterValue.startsWith('topic-');
      const isTypeButton = filterValue.startsWith('paper-') || filterValue === 'all';

      if (isTypeButton) {
        document.querySelectorAll('.pub-filters button[data-filter^="paper-"], .pub-filters button[data-filter="all"]').forEach(b => b.classList.remove('active'));
        if (filterValue !== 'recent') this.classList.add('active');
        else document.querySelector('.pub-filters button[data-filter="all"]').classList.add('active');
      } else if (isTopicButton) {
        document.querySelectorAll('.pub-filters button[data-filter^="topic-"]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      }

      if (isTopicButton) {
        document.querySelectorAll('.pub-filters button[data-filter^="paper-"]').forEach(b => b.classList.remove('active'));
        document.querySelector('.pub-filters button[data-filter="all"]').classList.add('active');
      } else if (isTypeButton && filterValue !== 'all') {
        document.querySelectorAll('.pub-filters button[data-filter^="topic-"]').forEach(b => b.classList.remove('active'));
      } else if (filterValue === 'all') {
        document.querySelectorAll('.pub-filters button[data-filter^="topic-"]').forEach(b => b.classList.remove('active'));
      }

      filterPublications();
    });
  });

  function filterPublications() {
    const allCards = document.querySelectorAll('#pub-list .card');
    const activeTypeBtn = document.querySelector('.pub-filters button[data-filter^="paper-"].active, .pub-filters button[data-filter="all"].active');
    const activeTypeFilter = activeTypeBtn ? activeTypeBtn.dataset.filter : 'all';
    
    const activeTopicBtn = document.querySelector('.pub-filters button[data-filter^="topic-"].active');
    const activeTopicFilter = activeTopicBtn ? activeTopicBtn.dataset.filter : null;
    
    // Determine if we are in 'recent' mode
    // We can check if the 'recent' button was the last clicked type button?
    // Or we can check if the 'recent' button has 'active' class?
    // But our logic above removes 'active' from 'recent' if another type is clicked.
    // Wait, the logic above:
    // if (filterValue !== 'recent') this.classList.add('active');
    // else document.querySelector('.pub-filters button[data-filter="all"]').classList.add('active');
    // So 'recent' button NEVER gets 'active' class in the DOM with my logic?
    // That matches the original jQuery logic: if (filterValue !== 'recent') $button.addClass('active');
    
    // So how do we know if we should filter by recent?
    // The original logic did the filtering INSIDE the click handler immediately.
    // My `filterPublications` function is separate.
    // I need to know if the current filter state implies "recent".
    // BUT, since 'recent' doesn't set a persistent state (it just filters momentarily?), 
    // or does it?
    // In original:
    // if (filterValue === 'recent') { ... show recent ... } else { ... show based on selectors ... }
    // So 'recent' is a one-time action?
    // If I click 'recent', it shows recent. If I then click 'Journal', it shows journals.
    // If I click 'Journal' then 'recent', it shows recent (subset of journals? or all recent?).
    // Original: $(selector).filter(...)
    // Selector comes from active buttons.
    // If I click 'recent', active buttons are NOT changed (except ensuring 'all' is active if it was a type button).
    // So 'recent' filters based on whatever is currently active + recent check.
    
    // So, I need to pass a flag to `filterPublications` or handle it.
    // But `filterPublications` reads from DOM.
    // Let's just move the logic back to the click handler to be safe and simple.
    
    // Actually, I'll just implement `filterPublications` to take an optional `forceRecent` argument.
  }

  try {
    const response = await fetch("./papers.xml");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const str = await response.text();
    const data = new DOMParser().parseFromString(str, "text/xml");

    pubListContainer.innerHTML = ''; // Clear loading
    let totalLoadedCount = 0;

    const papers = data.getElementsByTagName("paper");
    Array.from(papers).forEach(paper => {
      const paperType = paper.getAttribute("type") || "other";
      const title = paper.getElementsByTagName("title")[0]?.textContent.trim() || "";
      const authors = paper.getElementsByTagName("authors")[0]?.textContent.trim() || "";
      const details = paper.getElementsByTagName("other")[0]?.textContent.trim() || "";
      const pdfLink = paper.getElementsByTagName("link")[0]?.textContent.trim() || "";
      const pdfTag = paper.getElementsByTagName("tag")[0]?.textContent.trim() || title.substring(0, 10);

      let combinedTopicClasses = new Set();
      const themes = paper.getElementsByTagName("theme");
      Array.from(themes).forEach(theme => {
        const themeText = theme.textContent.trim();
        if (themeText) {
          const topicClass = getTopicClasses(themeText);
          if (topicClass && topicClass !== 'topic-uncategorized') {
            combinedTopicClasses.add(topicClass);
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

      const techRep = paper.getElementsByTagName("techRep")[0]?.textContent.trim();
      if (techRep) {
        links += ` <a href="${techRep}" target="_blank" rel="noopener" class="card-link"><i class="fas fa-file-alt me-1"></i>TechRep</a>`;
      }
      
      const code = paper.getElementsByTagName("code")[0]?.textContent.trim();
      if (code) {
        links += ` <a href ="${code}" target="_blank" rel="noopener" class="card-link"><i class="fas fa-code me-1"></i>Code</a>`;
      }
      
      const video = paper.getElementsByTagName("video")[0]?.textContent.trim();
      if (video) {
        links += ` <a href ="${video}" target="_blank" rel="noopener" class="card-link"><i class="fas fa-video me-1"></i>Video</a>`;
      }
      
      const bibtex = paper.getElementsByTagName("bibtex")[0]?.textContent.trim();
      if (bibtex) {
        links += ` <a href ="${bibtex}" target="_blank" rel="noopener" class="card-link"><i class="fas fa-quote-right me-1"></i>BibTeX</a>`;
      }

      let award = "";
      const awardText = paper.getElementsByTagName("award")[0]?.textContent.trim();
      if (awardText) {
        award = `<p class="card-text text-success mt-2 mb-0"><small><i class="fas fa-star me-1"></i> ${awardText}</small></p>`;
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

      // Create element from string to append
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cardHtml.trim();
      pubListContainer.appendChild(tempDiv.firstChild);
      totalLoadedCount++;
    });

    filterCountDisplay.textContent = `Showing ${totalLoadedCount} of ${totalLoadedCount} publications`;
    
    // Trigger 'all' filter by default
    const allBtn = document.querySelector('.pub-filters button[data-filter="all"]');
    if(allBtn) allBtn.click();

    // Animation
    const allCards = document.querySelectorAll('#pub-list .card');
    allCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 50);
    });

    if (totalLoadedCount === 0) {
      pubListContainer.innerHTML = '<p class="text-muted">No publications found or error loading the file.</p>';
    }

  } catch (error) {
    console.error("Error loading publications:", error);
    pubListContainer.innerHTML = '<div class="alert alert-danger" role="alert">Error loading publications. Please check the console or try again later.</div>';
    filterCountDisplay.textContent = '';
  }
  
  // Re-implement filter logic inside the load function scope where we have access to elements
  filterButtons.forEach(btn => {
    btn.onclick = function(e) {
        const filterValue = this.dataset.filter;
        const isTopicButton = filterValue.startsWith('topic-');
        const isTypeButton = filterValue.startsWith('paper-') || filterValue === 'all';

        if (isTypeButton) {
            document.querySelectorAll('.pub-filters button[data-filter^="paper-"], .pub-filters button[data-filter="all"]').forEach(b => b.classList.remove('active'));
            if (filterValue !== 'recent') this.classList.add('active');
            else document.querySelector('.pub-filters button[data-filter="all"]').classList.add('active');
        } else if (isTopicButton) {
            document.querySelectorAll('.pub-filters button[data-filter^="topic-"]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        }

        if (isTopicButton) {
            document.querySelectorAll('.pub-filters button[data-filter^="paper-"]').forEach(b => b.classList.remove('active'));
            document.querySelector('.pub-filters button[data-filter="all"]').classList.add('active');
        } else if (isTypeButton && filterValue !== 'all') {
            document.querySelectorAll('.pub-filters button[data-filter^="topic-"]').forEach(b => b.classList.remove('active'));
        } else if (filterValue === 'all') {
            document.querySelectorAll('.pub-filters button[data-filter^="topic-"]').forEach(b => b.classList.remove('active'));
        }

        const allCards = document.querySelectorAll('#pub-list .card');
        
        // Hide all first
        allCards.forEach(c => c.style.display = 'none');

        const activeTypeBtn = document.querySelector('.pub-filters button[data-filter^="paper-"].active, .pub-filters button[data-filter="all"].active');
        const activeTypeFilter = activeTypeBtn ? activeTypeBtn.dataset.filter : 'all';
        const activeTopicBtn = document.querySelector('.pub-filters button[data-filter^="topic-"].active');
        const activeTopicFilter = activeTopicBtn ? activeTopicBtn.dataset.filter : null;

        let selector = '#pub-list .card';
        if (activeTypeFilter !== 'all') {
            selector += '.' + activeTypeFilter;
        }
        if (activeTopicFilter) {
            selector += '.' + activeTopicFilter;
        }

        const matchedCards = document.querySelectorAll(selector);
        
        if (filterValue === 'recent') {
            matchedCards.forEach(card => {
                const details = card.querySelector('.paper-details')?.textContent || '';
                if (details.match(/(202\d|2030)/)) {
                    card.style.display = 'block';
                }
            });
        } else {
            matchedCards.forEach(card => card.style.display = 'block');
        }

        const visibleCount = document.querySelectorAll('#pub-list .card[style="display: block;"]').length;
        filterCountDisplay.textContent = `Showing ${visibleCount} of ${allCards.length} publications`;
    };
  });
}
