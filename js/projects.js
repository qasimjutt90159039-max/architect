/**
 * Archtech Architecture Firm - Projects Data & Interactive Portfolio System
 * Handles category filtering, interactive modal inspection, and project details
 */

const ARCHTECH_PROJECTS = [
  {
    id: 'res-01',
    title: 'The Travertine Pavilion',
    category: 'residential',
    categoryLabel: 'Residential',
    location: 'Gulberg V, Lahore',
    year: '2024',
    area: '9,200 sq.ft',
    materials: 'Roman Travertine, Fluted Timber, Corten Steel',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'A monolithic luxury residence configured around an internal courtyard and reflecting pool. Sculpted travertine masses frame panoramic interior vistas while providing passive solar shading against the intense Lahore summer sun.',
    details: 'Designed with a bioclimatic approach, the residence integrates double-glazed thermal break windows, geothermal cooling loops, and custom brass louvers. The ground floor merges seamlessly with the water garden, featuring a 24-foot cantilevered roof slab without perimeter columns.'
  },
  {
    id: 'com-01',
    title: 'Nexus Innovation Headquarters',
    category: 'commercial',
    categoryLabel: 'Commercial',
    location: 'Upper Mall, Lahore',
    year: '2023',
    area: '48,500 sq.ft',
    materials: 'High-Performance Low-E Glass, Exposed Concrete, Anodized Bronze',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: 'A landmark 12-storey corporate tower conceived as a vertical collaborative ecosystem. The façade features responsive kinetic solar fins calibrated to solar azimuth angles along the Lahore Mall corridor.',
    details: 'Awarded LEED Gold certification. The core design incorporates a central atrium bringing daylight 80 feet down into subterranean auditoriums. High-speed destination-dispatch elevators and rooftop biodiversity gardens complete this future-proof workspace.'
  },
  {
    id: 'int-01',
    title: 'Aura Haute Horlogerie Boutique',
    category: 'interior',
    categoryLabel: 'Interior',
    location: 'DHA Phase 5, Lahore',
    year: '2024',
    area: '3,800 sq.ft',
    materials: 'Smoked Oak, Nero Marquina Marble, Brushed Brass',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    description: 'An ultra-refined retail interior designed for Swiss timepieces. Deep charcoal walls and precision fiber-optic lighting choreograph a gallery-like ambience of contemplative luxury.',
    details: 'Custom acoustic timber baffles eliminate urban noise from the street, creating a serene, vault-like atmosphere. VIP tasting salons feature concealed temperature-controlled display vitrines and velvet-lined consulting alcoves.'
  },
  {
    id: 'cul-01',
    title: 'Lahore Center for Contemporary Arts',
    category: 'cultural',
    categoryLabel: 'Cultural & Public',
    location: 'Canal Bank, Lahore',
    year: '2023',
    area: '34,000 sq.ft',
    materials: 'Cast Board-Marked Concrete, Red Brick, Water Courtyards',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    description: 'A civic arts pavilion paying homage to Lahore\'s monumental brick heritage through contemporary brutalist geometry and expansive naturally ventilated exhibition halls.',
    details: 'The design uses traditional brick masonry jali screens re-engineered for thermal lag and indirect northern daylighting. Large open colonnades connect public parklands with internal performance auditoriums.'
  },
  {
    id: 'res-02',
    title: 'Cantilever Villa at Margalla Foothills',
    category: 'residential',
    categoryLabel: 'Residential',
    location: 'Sector E-7, Islamabad',
    year: '2022',
    area: '12,500 sq.ft',
    materials: 'Post-Tensioned Concrete, Cedar Siding, Structural Glass',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    description: 'Perched on the slope of the Margalla Hills, this residence features a dramatic 30-foot living pavilion suspended over a native pine grove.',
    details: 'The structure steps down the mountain contour to minimize cut-and-fill grading. Deep thermal mass retains heating during winter frost while cross-ventilating breezes cool the upper bedrooms in summer.'
  },
  {
    id: 'com-02',
    title: 'The Foundry Creative Hub',
    category: 'commercial',
    categoryLabel: 'Commercial',
    location: 'Gulberg III, Lahore',
    year: '2023',
    area: '26,000 sq.ft',
    materials: 'Reclaimed Industrial Steel, Perforated Zinc, Raw Concrete',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    description: 'Adaptive reuse and expansion of a former industrial casting facility into a multi-disciplinary design studio, maker spaces, and specialty coffee house.',
    details: 'Preserving the original 1950s steel trusses, the project inserted mezzanine pods crafted from structural plywood and glass. The central sky-lit atrium serves as an amphitheater for community architectural lectures.'
  },
  {
    id: 'int-02',
    title: 'The Scotch Corner Penthouse',
    category: 'interior',
    categoryLabel: 'Interior',
    location: 'Upper Mall Scheme, Lahore',
    year: '2024',
    area: '5,400 sq.ft',
    materials: 'Italian Calacatta Viola, Smoked Walnut, Linen Wallcoverings',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    description: 'A bespoke duplex penthouse with 360-degree skyline views of Lahore. Minimalist spatial transitions blend warm materiality with custom architectural millwork.',
    details: 'Every lighting fixture and brass handle was custom cast in Lahore workshops to Archtech specifications. Includes a private terrace plunge pool and integrated climate automation system.'
  },
  {
    id: 'cul-02',
    title: 'Shalamar Heritage Interpretive Center',
    category: 'cultural',
    categoryLabel: 'Cultural & Public',
    location: 'GT Road, Lahore',
    year: '2022',
    area: '18,200 sq.ft',
    materials: 'Terracotta Tiles, Lime Plaster, Cast Bronze',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    description: 'A low-slung, non-intrusive visitor pavilion adjacent to UNESCO World Heritage gardens, using ancient lime plaster techniques and contemporary geometry.',
    details: 'Designed to blend respectfully into the historic skyline. Subterranean display vaults protect delicate archival manuscripts while above-ground viewing terraces offer panoramic views over the historic Mughal fountains.'
  },
  {
    id: 'res-03',
    title: 'The Courtyard Sanctuary',
    category: 'residential',
    categoryLabel: 'Residential',
    location: 'DHA Phase 6, Lahore',
    year: '2024',
    area: '8,500 sq.ft',
    materials: 'Hand-Cut Sandstone, Water-Stained Teak, White Travertine',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    description: 'An introspective family home configured around an internal oasis of mature neem trees, water cascades, and deep sheltered verandahs.',
    details: 'Engineered with double brick cavity walls and shaded thermal breaks, achieving up to 35% reduction in cooling energy demand compared to conventional construction.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilter();
  initProjectModal();
});

/**
 * Filter projects by category
 */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Project Detail Lightbox Modal
 */
function initProjectModal() {
  const modalBackdrop = document.querySelector('.project-modal-backdrop');
  if (!modalBackdrop) return;

  const closeBtn = modalBackdrop.querySelector('.modal-close-btn');
  const modalImg = modalBackdrop.querySelector('.modal-image-wrap img');
  const modalCategory = modalBackdrop.querySelector('.modal-category-tag');
  const modalTitle = modalBackdrop.querySelector('.modal-title');
  const modalLocation = modalBackdrop.querySelector('.modal-spec-location');
  const modalYear = modalBackdrop.querySelector('.modal-spec-year');
  const modalArea = modalBackdrop.querySelector('.modal-spec-area');
  const modalMaterials = modalBackdrop.querySelector('.modal-spec-materials');
  const modalDesc = modalBackdrop.querySelector('.modal-desc');
  const modalDetails = modalBackdrop.querySelector('.modal-details-extra');

  const openModal = (projectId) => {
    const project = ARCHTECH_PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    modalImg.src = project.image;
    modalImg.alt = project.title;
    if (modalCategory) modalCategory.textContent = project.categoryLabel;
    if (modalTitle) modalTitle.textContent = project.title;
    if (modalLocation) modalLocation.textContent = project.location;
    if (modalYear) modalYear.textContent = project.year;
    if (modalArea) modalArea.textContent = project.area;
    if (modalMaterials) modalMaterials.textContent = project.materials;
    if (modalDesc) modalDesc.textContent = project.description;
    if (modalDetails) modalDetails.textContent = project.details;

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Attach click listener to all project cards or view buttons
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-project-id]');
    if (trigger) {
      e.preventDefault();
      const projectId = trigger.getAttribute('data-project-id');
      openModal(projectId);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}
