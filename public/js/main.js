// Main JavaScript file for the job portal

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Elevate Workforce Portal Loading...")

  // Add fade-in animation to elements with staggered delay
  const fadeElements = document.querySelectorAll(".fade-in")
  fadeElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.2}s`
  })

  // Add floating animation to floating elements
  const floatingElements = document.querySelectorAll(".floating")
  floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.5}s`
  })

  // Enhanced form submissions with beautiful loading states
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", () => {
      const submitBtn = form.querySelector('button[type="submit"]')
      if (submitBtn) {
        const originalText = submitBtn.innerHTML
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 🚀 Processing Magic...'
        submitBtn.disabled = true
        submitBtn.style.background = "linear-gradient(135deg, #74b9ff, #0984e3)"

        // Re-enable after 5 seconds as fallback
        setTimeout(() => {
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
          submitBtn.style.background = ""
        }, 5000)
      }
    })
  })

  // Enhanced delete confirmations with emojis
  const deleteButtons = document.querySelectorAll("[data-confirm]")
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const message = this.getAttribute("data-confirm") || "🤔 Are you sure you want to delete this?"
      if (!confirm("⚠️ " + message + " This action cannot be undone! 🗑️")) {
        e.preventDefault()
      }
    })
  })

  // Auto-hide alerts with beautiful fade out animation
  const alerts = document.querySelectorAll(".alert")
  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.style.transition = "all 0.5s ease"
      alert.style.opacity = "0"
      alert.style.transform = "translateY(-20px)"
      setTimeout(() => {
        alert.remove()
      }, 500)
    }, 6000)
  })

  // Enhanced mobile menu toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const navLinks = document.querySelector(".nav-links")

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show")
      navLinks.style.animation = "slideIn 0.3s ease"
    })
  }

  // Smooth scrolling for anchor links with easing
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Beautiful loading spinner with rainbow colors
  function showLoading() {
    const loading = document.createElement("div")
    loading.className = "loading-overlay"
    loading.innerHTML = `
      <div style="text-align: center;">
        <div class="spinner" style="border-top-color: #ff6b6b;"></div>
        <p style="color: #667eea; font-weight: bold; margin-top: 1rem;">🚀 Loading Amazing Content...</p>
      </div>
    `
    loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9));
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `
    document.body.appendChild(loading)
    return loading
  }

  function hideLoading(loadingElement) {
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.style.animation = "fadeOut 0.3s ease"
      setTimeout(() => {
        loadingElement.parentNode.removeChild(loadingElement)
      }, 300)
    }
  }

  // Make loading functions globally available
  window.showLoading = showLoading
  window.hideLoading = hideLoading

  // Enhanced status updates with beautiful notifications
  window.updateStatus = async (url, data) => {
    const loading = showLoading()
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      hideLoading(loading)

      if (result.success) {
        // Show beautiful success message
        showNotification("🎉 " + result.message, "success")

        // Reload page after short delay
        setTimeout(() => {
          location.reload()
        }, 1500)
      } else {
        throw new Error(result.error || "Operation failed")
      }
    } catch (error) {
      hideLoading(loading)
      showNotification("❌ Error: " + error.message, "error")
    }
  }

  // Beautiful notification system
  function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = message

    const colors = {
      success: "linear-gradient(135deg, #00b894, #00a085)",
      error: "linear-gradient(135deg, #e17055, #d63031)",
      info: "linear-gradient(135deg, #74b9ff, #0984e3)",
      warning: "linear-gradient(135deg, #fdcb6e, #e17055)",
    }

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type] || colors.info};
      color: white;
      padding: 1rem 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      z-index: 10000;
      font-weight: bold;
      animation: slideInRight 0.5s ease;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.5s ease"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 500)
    }, 4000)
  }

  // Enhanced modal functionality with beautiful animations
  window.openModal = (modalId) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.add("show")
      document.body.style.overflow = "hidden"
      modal.style.animation = "modalFadeIn 0.3s ease"
    }
  }

  window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.animation = "modalFadeOut 0.3s ease"
      setTimeout(() => {
        modal.classList.remove("show")
        document.body.style.overflow = "auto"
      }, 300)
    }
  }

  // Close modal when clicking outside with animation
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.animation = "modalFadeOut 0.3s ease"
      setTimeout(() => {
        e.target.classList.remove("show")
        document.body.style.overflow = "auto"
      }, 300)
    }
  })

  // Handle escape key for modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModal = document.querySelector(".modal.show")
      if (openModal) {
        openModal.style.animation = "modalFadeOut 0.3s ease"
        setTimeout(() => {
          openModal.classList.remove("show")
          document.body.style.overflow = "auto"
        }, 300)
      }
    }
  })

  // Add hover effects to buttons
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.05)"
    })

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })

  // Add ripple effect to buttons
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `

      this.style.position = "relative"
      this.style.overflow = "hidden"
      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })

  console.log("✨ Elevate Workforce Portal Loaded Successfully! 🎉")
})

// Enhanced utility functions with emojis
function formatDate(dateString) {
  const date = new Date(dateString)
  return (
    "📅 " +
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  )
}

function formatCurrency(amount) {
  return (
    "💰 " +
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
    }).format(amount)
  )
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Enhanced search functionality with beautiful animations
function initializeSearch() {
  const searchInput = document.querySelector("#search")
  if (searchInput) {
    searchInput.placeholder = "🔍 Search for amazing opportunities..."

    const debouncedSearch = debounce((query) => {
      console.log("🔍 Searching for:", query)
      // Add search animation
      searchInput.style.background = "linear-gradient(135deg, rgba(116, 185, 255, 0.1), rgba(9, 132, 227, 0.1))"
      setTimeout(() => {
        searchInput.style.background = ""
      }, 1000)
    }, 300)

    searchInput.addEventListener("input", function () {
      debouncedSearch(this.value)
    })

    searchInput.addEventListener("focus", function () {
      this.style.transform = "scale(1.02)"
      this.style.boxShadow = "0 10px 30px rgba(116, 185, 255, 0.3)"
    })

    searchInput.addEventListener("blur", function () {
      this.style.transform = "scale(1)"
      this.style.boxShadow = ""
    })
  }
}

// Initialize search on page load
document.addEventListener("DOMContentLoaded", initializeSearch)

// Add CSS animations dynamically
const style = document.createElement("style")
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes modalFadeOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.9); }
  }
  
  @keyframes ripple {
    to { transform: scale(4); opacity: 0; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`
document.head.appendChild(style)
