// State
let currentChecklist = [];
let contractDetails = {};
let checkedItems = new Set();

// DOM Elements
const views = {
  landing: document.getElementById('view-landing'),
  form: document.getElementById('view-form'),
  loading: document.getElementById('view-loading'),
  results: document.getElementById('view-results')
};

// Navigation Buttons
const btnStart = document.getElementById('btn-start');
const btnBackForm = document.getElementById('btn-back-form');
const btnNew = document.getElementById('btn-new');
const btnReset = document.getElementById('btn-reset');
const btnCopy = document.getElementById('btn-copy');

// Form
const form = document.getElementById('contract-form');

// Results elements
const checklistContainer = document.getElementById('checklist-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const copyToast = document.getElementById('copy-toast');

// Initialize
function init() {
  bindEvents();
  loadState();
}

function bindEvents() {
  btnStart.addEventListener('click', () => switchView('form'));
  btnBackForm.addEventListener('click', () => switchView('landing'));
  btnNew.addEventListener('click', startNew);
  btnReset.addEventListener('click', resetProgress);
  btnCopy.addEventListener('click', copyChecklist);
  
  form.addEventListener('submit', handleFormSubmit);
}

function switchView(viewName) {
  Object.values(views).forEach(view => view.classList.add('hidden'));
  Object.values(views).forEach(view => view.classList.remove('active'));
  
  views[viewName].classList.remove('hidden');
  // Small delay to allow display:block to apply before opacity transition
  setTimeout(() => {
    views[viewName].classList.add('active');
  }, 10);
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  contractDetails = {
    type: document.getElementById('contractType').value,
    role: document.getElementById('userRole').value,
    party: document.getElementById('otherParty').value,
    jurisdiction: document.getElementById('jurisdiction').value,
    description: document.getElementById('description').value
  };

  switchView('loading');
  
  // Simulate processing time
  setTimeout(() => {
    generateChecklist();
    populateSummary();
    renderChecklist();
    switchView('results');
    saveState();
  }, 1500);
}

function populateSummary() {
  document.getElementById('sum-type').textContent = contractDetails.type;
  document.getElementById('sum-role').textContent = contractDetails.role;
  document.getElementById('sum-party').textContent = contractDetails.party;
  document.getElementById('sum-jurisdiction').textContent = contractDetails.jurisdiction;
}

// Checklist Generation Logic
function generateChecklist() {
  currentChecklist = [];
  checkedItems.clear();
  
  const baseItems = getBaseChecklist();
  const specificItems = getTypeSpecificItems(contractDetails.type);
  
  // Combine and sort by category
  let combined = [...baseItems, ...specificItems];
  
  // Group by category
  const grouped = {};
  combined.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    // Prevent exact duplicates
    if (!grouped[item.category].find(existing => existing.title === item.title)) {
      item.id = generateId(item.title);
      grouped[item.category].push(item);
    }
  });

  currentChecklist = grouped;
}

function generateId(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
}

function renderChecklist() {
  checklistContainer.innerHTML = '';
  
  const categoriesOrder = [
    'PARTIES & BASIC DETAILS',
    'SCOPE & RESPONSIBILITIES',
    'PAYMENT & FINANCIAL TERMS',
    'TERM & TERMINATION',
    'INTELLECTUAL PROPERTY',
    'CONFIDENTIALITY & PRIVACY',
    'LIABILITY & RISK',
    'DISPUTES & GOVERNING LAW',
    'SIGNATURES & FINAL REVIEW'
  ];

  categoriesOrder.forEach(cat => {
    if (currentChecklist[cat] && currentChecklist[cat].length > 0) {
      const catDiv = document.createElement('div');
      catDiv.className = 'checklist-category';
      
      const catHeader = document.createElement('h3');
      catHeader.textContent = cat;
      catDiv.appendChild(catHeader);
      
      const itemsDiv = document.createElement('div');
      itemsDiv.className = 'checklist-items';
      
      currentChecklist[cat].forEach(item => {
        const itemEl = createItemElement(item);
        itemsDiv.appendChild(itemEl);
      });
      
      catDiv.appendChild(itemsDiv);
      checklistContainer.appendChild(catDiv);
    }
  });
  
  updateProgress();
}

function createItemElement(item) {
  const div = document.createElement('div');
  div.className = 'check-item';
  div.id = `container-${item.id}`;
  if (checkedItems.has(item.id)) {
    div.classList.add('completed');
  }
  
  const checkboxWrapper = document.createElement('div');
  checkboxWrapper.className = 'checkbox-wrapper';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = item.id;
  checkbox.checked = checkedItems.has(item.id);
  checkbox.addEventListener('change', (e) => toggleItem(item.id, e.target.checked));
  
  checkboxWrapper.appendChild(checkbox);
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'item-content';
  
  const headerDiv = document.createElement('div');
  headerDiv.className = 'item-header';
  
  const title = document.createElement('h4');
  title.textContent = item.title;
  
  const badge = document.createElement('span');
  badge.className = `priority-badge priority-${item.priority.toLowerCase()}`;
  badge.textContent = item.priority;
  
  headerDiv.appendChild(title);
  headerDiv.appendChild(badge);
  
  const desc = document.createElement('p');
  desc.textContent = item.description;
  
  contentDiv.appendChild(headerDiv);
  contentDiv.appendChild(desc);
  
  div.appendChild(checkboxWrapper);
  div.appendChild(contentDiv);
  
  return div;
}

function toggleItem(id, isChecked) {
  const container = document.getElementById(`container-${id}`);
  if (isChecked) {
    checkedItems.add(id);
    container.classList.add('completed');
  } else {
    checkedItems.delete(id);
    container.classList.remove('completed');
  }
  updateProgress();
  saveState();
}

function updateProgress() {
  let total = 0;
  Object.values(currentChecklist).forEach(items => total += items.length);
  const checked = checkedItems.size;
  
  progressText.textContent = `${checked} of ${total} items completed`;
  
  const percentage = total === 0 ? 0 : Math.round((checked / total) * 100);
  progressBar.style.width = `${percentage}%`;
  
  if (percentage === 100 && total > 0) {
    progressText.style.color = 'var(--success)';
  } else {
    progressText.style.color = 'var(--primary)';
  }
}

function resetProgress() {
  if (confirm('Are you sure you want to uncheck all items?')) {
    checkedItems.clear();
    const checkboxes = document.querySelectorAll('.checklist-container input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.checked = false;
      document.getElementById(`container-${cb.id}`).classList.remove('completed');
    });
    updateProgress();
    saveState();
  }
}

function startNew() {
  if (confirm('Start a new checklist? Current progress will be lost.')) {
    checkedItems.clear();
    currentChecklist = {};
    contractDetails = {};
    form.reset();
    localStorage.removeItem('contractBotState');
    switchView('landing');
  }
}

function copyChecklist() {
  let text = `Contract Review Checklist\nType: ${contractDetails.type}\nRole: ${contractDetails.role}\nOther Party: ${contractDetails.party}\nJurisdiction: ${contractDetails.jurisdiction}\n\n`;
  
  Object.keys(currentChecklist).forEach(cat => {
    text += `\n=== ${cat} ===\n`;
    currentChecklist[cat].forEach(item => {
      const mark = checkedItems.has(item.id) ? '[X]' : '[ ]';
      text += `${mark} ${item.title} (${item.priority})\n    ${item.description}\n`;
    });
  });
  
  navigator.clipboard.writeText(text).then(() => {
    copyToast.classList.remove('hidden');
    setTimeout(() => {
      copyToast.classList.add('hidden');
    }, 3000);
  }).catch(err => {
    console.error('Could not copy text: ', err);
    alert('Failed to copy to clipboard.');
  });
}

function saveState() {
  const state = {
    details: contractDetails,
    checklist: currentChecklist,
    checked: Array.from(checkedItems)
  };
  localStorage.setItem('contractBotState', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('contractBotState');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      if (state.details && state.checklist) {
        contractDetails = state.details;
        currentChecklist = state.checklist;
        checkedItems = new Set(state.checked || []);
        
        // Populate form if needed (optional)
        document.getElementById('contractType').value = contractDetails.type;
        document.getElementById('userRole').value = contractDetails.role;
        document.getElementById('otherParty').value = contractDetails.party;
        document.getElementById('jurisdiction').value = contractDetails.jurisdiction;
        
        populateSummary();
        renderChecklist();
        switchView('results');
      }
    } catch (e) {
      console.error('Error loading state', e);
    }
  }
}

// --- Data Definitions ---

function getBaseChecklist() {
  return [
    {
      category: 'PARTIES & BASIC DETAILS',
      title: 'Correct Party Names',
      description: 'Check whether all party names, company forms (e.g., LLC, Inc), and contact details are accurate.',
      priority: 'High'
    },
    {
      category: 'PARTIES & BASIC DETAILS',
      title: 'Effective Date',
      description: 'Confirm that the contract states precisely when it comes into effect.',
      priority: 'High'
    },
    {
      category: 'TERM & TERMINATION',
      title: 'Contract Duration',
      description: 'Is the length of the agreement clearly stated? Check whether it automatically renews.',
      priority: 'High'
    },
    {
      category: 'TERM & TERMINATION',
      title: 'Termination for Convenience',
      description: 'Can either party end the agreement without cause? Check the required notice period.',
      priority: 'Medium'
    },
    {
      category: 'LIABILITY & RISK',
      title: 'Limitation of Liability',
      description: 'Does the contract cap damages if something goes wrong? This is critical to review.',
      priority: 'High'
    },
    {
      category: 'DISPUTES & GOVERNING LAW',
      title: 'Governing Law & Jurisdiction',
      description: 'Confirm that the governing law matches your jurisdiction or an acceptable neutral one.',
      priority: 'High'
    },
    {
      category: 'SIGNATURES & FINAL REVIEW',
      title: 'Signatures and Dates',
      description: 'Are all required signature blocks present, and is there space for dates and titles?',
      priority: 'High'
    },
    {
      category: 'SIGNATURES & FINAL REVIEW',
      title: 'Exhibits and Attachments',
      description: 'Are all referenced appendices, SOWs, or schedules actually attached?',
      priority: 'Medium'
    }
  ];
}

function getTypeSpecificItems(type) {
  const items = [];
  
  if (type === 'Freelance Agreement' || type === 'Service Agreement' || type === 'Consulting Agreement') {
    items.push({
      category: 'SCOPE & RESPONSIBILITIES',
      title: 'Scope of Work',
      description: 'Is exactly what you are doing (and not doing) clearly defined?',
      priority: 'High'
    }, {
      category: 'SCOPE & RESPONSIBILITIES',
      title: 'Revision Policy',
      description: 'Does the agreement limit the number of revisions before additional fees apply?',
      priority: 'Medium'
    }, {
      category: 'PAYMENT & FINANCIAL TERMS',
      title: 'Payment Schedule',
      description: 'Are payment dates or milestones clear? Consider checking if a deposit is required.',
      priority: 'High'
    }, {
      category: 'PAYMENT & FINANCIAL TERMS',
      title: 'Late Payment Penalties',
      description: 'Are there consequences specified if the client pays late?',
      priority: 'Low'
    }, {
      category: 'INTELLECTUAL PROPERTY',
      title: 'IP Ownership (Upon Payment)',
      description: 'Check whether IP transfers to the client *only* after full payment is received.',
      priority: 'High'
    });
  }

  if (type === 'Employment Contract') {
    items.push({
      category: 'SCOPE & RESPONSIBILITIES',
      title: 'Job Role & Duties',
      description: 'Is your title and primary responsibilities accurately described?',
      priority: 'High'
    }, {
      category: 'PAYMENT & FINANCIAL TERMS',
      title: 'Compensation & Benefits',
      description: 'Verify salary, bonus structure, health benefits, and paid time off (PTO) accruals.',
      priority: 'High'
    }, {
      category: 'TERM & TERMINATION',
      title: 'Probationary Period',
      description: 'Is there a probation period? Check the termination rules during this time.',
      priority: 'Medium'
    }, {
      category: 'CONFIDENTIALITY & PRIVACY',
      title: 'Non-Compete / Non-Solicit',
      description: 'Are there restrictions on working for competitors after you leave? Are they reasonable?',
      priority: 'High'
    });
  }

  if (type === 'Non-Disclosure Agreement') {
    items.push({
      category: 'CONFIDENTIALITY & PRIVACY',
      title: 'Definition of Confidential Information',
      description: 'Is the definition of what is considered confidential specific and clear?',
      priority: 'High'
    }, {
      category: 'CONFIDENTIALITY & PRIVACY',
      title: 'Standard Exceptions',
      description: 'Does it exclude information already public or known to you prior to the agreement?',
      priority: 'Medium'
    }, {
      category: 'CONFIDENTIALITY & PRIVACY',
      title: 'Duration of Confidentiality',
      description: 'How long do the obligations last? (e.g., 2 years, indefinitely?)',
      priority: 'High'
    }, {
      category: 'CONFIDENTIALITY & PRIVACY',
      title: 'Return or Destruction of Data',
      description: 'Is there a clear process for deleting or returning data once the agreement ends?',
      priority: 'Medium'
    });
  }
  
  if (type === 'Lease Agreement') {
    items.push({
      category: 'PAYMENT & FINANCIAL TERMS',
      title: 'Rent and Deposit',
      description: 'Is the rent amount, due date, and security deposit handling clearly outlined?',
      priority: 'High'
    }, {
      category: 'SCOPE & RESPONSIBILITIES',
      title: 'Maintenance and Repairs',
      description: 'Who is responsible for repairs? What is the process for submitting a request?',
      priority: 'High'
    });
  }

  // Fallback for others
  if (items.length === 0) {
    items.push({
      category: 'SCOPE & RESPONSIBILITIES',
      title: 'Specific Obligations',
      description: 'Are the exact obligations of both parties clearly defined?',
      priority: 'High'
    }, {
      category: 'PAYMENT & FINANCIAL TERMS',
      title: 'Financial Considerations',
      description: 'Are any fees, costs, or value exchanges clearly documented?',
      priority: 'High'
    });
  }

  return items;
}

// Run
document.addEventListener('DOMContentLoaded', init);
