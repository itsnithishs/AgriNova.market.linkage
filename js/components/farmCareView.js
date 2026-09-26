/**
 * AgriNova Platform - FarmCare View
 * Crop Health, Weather Implications, Field Task Management & Irrigation Schedules (Requirements 45–48).
 */

import { Icons } from "./icons.js";
import { store } from "../state/store.js";

export function renderFarmCare(state) {
  const tasks = state.tasks;
  const weather = state.weather;
  const health = state.farmHealth;
  const activeCrop = state.crops.find((c) => c.id === state.selectedCropId) || state.crops[0];

  return `
    <div class="farmcare-view-container animate-fade-in">
      
      <!-- Page Header (Requirement 45) -->
      <div class="farmcare-page-header">
        <div>
          <span class="eyebrow-accent">LEVEL 2 — AGRONOMIC SUPPORT</span>
          <h1 class="page-title-main">FarmCare & Advisory</h1>
          <p class="page-subtitle">Protect crop yield, schedule timely field tasks, and mitigate weather-induced transport delays.</p>
        </div>

        <div class="header-actions-group">
          <button class="btn btn-primary btn-sm" onclick="window.AgriNova.openAddTaskModal()">
            ${Icons.plus("icon-xs")}
            <span>Schedule New Field Task</span>
          </button>
        </div>
      </div>

      <!-- Top Row: Crop Health & Weather Impact Matrix (Requirements 46 & 47) -->
      <div class="farmcare-top-grid">
        
        <!-- CROP HEALTH CARD (Requirement 46) -->
        <div class="card crop-health-detail-card">
          <div class="card-header">
            <div>
              <span class="eyebrow-subtle">VITALITY MONITOR</span>
              <h3 class="card-title-md">Crop Health: ${activeCrop.name}</h3>
              <span class="text-xs text-subtle">Stage: ${activeCrop.status} (${activeCrop.growthDays} days)</span>
            </div>
            <div class="health-large-badge">
              <span class="score-large">${health.overallScore}</span>
              <span class="score-den">/100</span>
            </div>
          </div>

          <div class="health-components-grid">
            ${health.components
              .map(
                (comp) => `
              <div class="h-comp-box">
                <div class="h-comp-header">
                  <span class="h-comp-title">${comp.name}</span>
                  <span class="h-comp-score font-semibold">${comp.score}%</span>
                </div>
                <div class="health-progress-track">
                  <div class="health-progress-fill" style="width: ${comp.score}%;"></div>
                </div>
                <span class="h-comp-status text-xs">${comp.status}</span>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="health-advisory-note">
            ${Icons.info("icon-xs text-primary")}
            <span><strong>Agronomic Note:</strong> Observational score compiled from growth timeline and local humidity. For fungal diagnoses, consult your local Krishi Vigyan Kendra (KVK).</span>
          </div>
        </div>

        <!-- WEATHER IMPACT MATRIX (Requirement 47) -->
        <div class="card weather-matrix-card">
          <div class="card-header">
            <div>
              <span class="eyebrow-subtle">MICRO-CLIMATE ADVISORY</span>
              <h3 class="card-title-md">5-Day Weather & Agricultural Impact</h3>
              <span class="text-xs text-subtle">${weather.location}</span>
            </div>
            <div class="weather-temp-large">${weather.tempC}°C</div>
          </div>

          <!-- 5-Day Strip -->
          <div class="weather-forecast-strip">
            ${weather.forecastNext5Days
              .map(
                (d) => `
              <div class="forecast-day-cell">
                <span class="f-day">${d.day}</span>
                <span class="f-icon">${Icons.cloudRain("icon-xs text-accent")}</span>
                <span class="f-temps">${d.tempHigh}° / ${d.tempLow}°</span>
                <span class="f-rain text-xs text-subtle">${d.rainChance}% rain</span>
              </div>
            `
              )
              .join("")}
          </div>

          <!-- 4 Translation Impact Pillars (Requirement 47) -->
          <div class="impact-pillars-grid">
            <div class="impact-pillar">
              <span class="pillar-label">${Icons.calendar("icon-xxs")} Harvesting:</span>
              <p class="pillar-text">${weather.implications.harvesting}</p>
            </div>
            <div class="impact-pillar">
              <span class="pillar-label">${Icons.droplet ? Icons.droplet("icon-xxs") : Icons.info("icon-xxs")} Irrigation:</span>
              <p class="pillar-text">${weather.implications.irrigation}</p>
            </div>
            <div class="impact-pillar">
              <span class="pillar-label">${Icons.truck("icon-xxs")} Transportation:</span>
              <p class="pillar-text">${weather.implications.transport}</p>
            </div>
            <div class="impact-pillar">
              <span class="pillar-label">${Icons.shield("icon-xxs")} Crop Protection:</span>
              <p class="pillar-text">${weather.implications.cropCare}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- FIELD TASKS MANAGER (Requirement 48) -->
      <div class="card field-tasks-manager-card">
        <div class="card-header">
          <div>
            <span class="eyebrow-accent">ACTIONABLE FARM OPERATIONS</span>
            <h3 class="card-title-lg">Scheduled Field Tasks</h3>
            <p class="card-subtitle-sub">Tasks synchronize automatically with your main dashboard alerts</p>
          </div>
        </div>

        <div class="tasks-full-list">
          ${tasks
            .map((task) => {
              const isCompleted = task.status === "COMPLETED";
              return `
              <div class="task-full-row ${isCompleted ? 'task-done' : ''}">
                <div class="task-checkbox-col" onclick="window.AgriNova.toggleTask('${task.id}')">
                  <div class="task-square-check ${isCompleted ? 'checked' : ''}">
                    ${isCompleted ? Icons.check("icon-xs") : ""}
                  </div>
                </div>

                <div class="task-main-col">
                  <div class="task-title-line">
                    <h4 class="task-full-title">${task.title}</h4>
                    <span class="task-category-pill">${task.category}</span>
                    <span class="task-crop-tag">${task.cropName}</span>
                  </div>
                  <p class="task-instructions">${task.instructions}</p>
                  <div class="task-meta-line">
                    <span class="due-text">${Icons.calendar("icon-xxs")} Target Date: <strong>${task.dueDate}</strong></span>
                    <span class="bullet">•</span>
                    <span class="urgency-tag ${task.urgency.toLowerCase()}">${task.urgency} Urgency</span>
                  </div>
                </div>

                <div class="task-action-col">
                  <button 
                    class="btn ${isCompleted ? 'btn-outline' : 'btn-secondary'} btn-xs" 
                    onclick="window.AgriNova.toggleTask('${task.id}')"
                  >
                    ${isCompleted ? 'Mark Pending' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>

    </div>
  `;
}
