// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // ПЕРЕМЕННЫЕ ДЛЯ НОВЫХ ФУНКЦИЙ
    // ============================================
    let splitMode = 1;
    let activeSection = 1;
    let isFurnitureVisible = true;
    let isWallsOnlyMode = false;
    
    // Элементы комнаты
    const mainWall = document.getElementById('mainWall');
    const lightBulb = document.getElementById('lightBulb');
    const tv = document.getElementById('tv');
    const cabinet = document.getElementById('cabinet');
    const chest = document.getElementById('chest');
    const shelf = document.getElementById('shelf');
    const plant = document.getElementById('plant');
    
    // Элементы управления
    const warmBtn = document.getElementById('warmBtn');
    const coldBtn = document.getElementById('coldBtn');
    const lightToggleBtn = document.getElementById('lightToggleBtn');
    const temperatureInput = document.getElementById('temperatureInput');
    const tempValue = document.getElementById('tempValue');
    const catalogButtons = document.querySelectorAll('.catalog-btn');
    const colorCodeInput = document.getElementById('colorCode');
    const applyWallColorBtn = document.getElementById('applyWallColor');
    const tvColorPicker = document.getElementById('tvColor');
    const cabinetColorPicker = document.getElementById('cabinetColor');
    const chestColorPicker = document.getElementById('chestColor');
    const shelfColorPicker = document.getElementById('shelfColor');
    const plantPotColorPicker = document.getElementById('plantPotColor');
    const plantColorPicker = document.getElementById('plantColor');
    const resetBtn = document.getElementById('resetBtn');
    const status = document.getElementById('status');
    const colorNameContainer = document.getElementById('colorNameContainer');
    
    // Элементы для отображения HEX кодов
    const tvHex = tvColorPicker.nextElementSibling;
    const cabinetHex = cabinetColorPicker.nextElementSibling;
    const chestHex = chestColorPicker.nextElementSibling;
    const shelfHex = shelfColorPicker.nextElementSibling;
    const plantPotHex = plantPotColorPicker.nextElementSibling;
    const plantHex = plantColorPicker.nextElementSibling;
    
    // Элементы новой секции подбора цветов
    const catalogPickerButtons = document.querySelectorAll('.catalog-btn-picker');
    const colorPickerInput = document.getElementById('colorPickerInput');
    const pickColorsBtn = document.getElementById('pickColorsBtn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const colorsGrid = document.getElementById('colorsGrid');
    
    // Элементы новых функций
    const toggleFurnitureBtn = document.getElementById('toggleFurnitureBtn');
    const wallsOnlyBtn = document.getElementById('wallsOnlyBtn');
    const resetWallsBtn = document.getElementById('resetWallsBtn');
    const splitButtons = document.querySelectorAll('.split-btn');
    const sectionButtons = document.querySelectorAll('.section-btn');
    const currentSectionSpan = document.getElementById('currentSection');
    const sectionInfo = document.getElementById('sectionInfo');
    const sectionSelector = document.getElementById('sectionSelector');
    
    // Текущий выбранный каталог
    let currentCatalog = 'ral';
    let currentPickerCatalog = 'ral';
    let currentMode = 'similar';
    
    // Состояние освещения
    let isLightOn = true;
    let currentTemperature = 4000;
    
    // Начальные значения
    const initialValues = {
        wallColor: '#ffffff',
        lightTemperature: 4000,
        tvColor: '#222222',
        cabinetColor: '#8b4513',
        chestColor: '#654321',
        shelfColor: '#d2691e',
        plantPotColor: '#a0522d',
        plantColor: '#32cd32'
    };
    
    // ============================================
    // ОСНОВНЫЕ ФУНКЦИИ (из твоего рабочего кода)
    // ============================================
    
    // Обновление статуса
    function updateStatus(message) {
        status.innerHTML = `ℹ️ Статус: ${message}`;
    }
    
    // Создание индикатора состояния света
    function createLightStatusIndicator() {
        const lightStatus = document.createElement('div');
        lightStatus.className = 'light-status on';
        lightStatus.id = 'lightStatus';
        lightStatus.innerHTML = '💡 Свет включен (4000K)';
        
        const rangeValue = document.querySelector('.range-value');
        rangeValue.parentNode.insertBefore(lightStatus, rangeValue.nextSibling);
        
        return lightStatus;
    }
    
    // Функция для затемнения цвета (эффект объема краски)
    function darkenColor(color, percent) {
        if (!color || !color.startsWith('#')) return color;
        
        try {
            let r = parseInt(color.substr(1, 2), 16);
            let g = parseInt(color.substr(3, 2), 16);
            let b = parseInt(color.substr(5, 2), 16);
            
            r = Math.floor(r * (100 - percent) / 100);
            g = Math.floor(g * (100 - percent) / 100);
            b = Math.floor(b * (100 - percent) / 100);
            
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        } catch (e) {
            return color;
        }
    }
    
    // Функция для применения цветового оттенка (эффект температуры света)
    function applyTemperatureTint(color, temperature) {
        if (!color || !color.startsWith('#')) return color;
        
        try {
            let r = parseInt(color.substr(1, 2), 16);
            let g = parseInt(color.substr(3, 2), 16);
            let b = parseInt(color.substr(5, 2), 16);
            
            if (temperature < 3500) {
                // Теплый свет - добавляем желтый/красный оттенок
                r = Math.min(255, r + 15);
                g = Math.min(255, g + 10);
            } else {
                // Холодный свет - добавляем синий оттенок
                b = Math.min(255, b + 15);
                g = Math.min(255, g + 5);
            }
            
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        } catch (e) {
            return color;
        }
    }
    
    // Обновление названия цвета
    function updateColorName() {
        const colorCode = colorCodeInput.value.trim();
        if (!colorCode) {
            colorNameContainer.innerHTML = '';
            return;
        }
        
        const colorInfo = getColorFromCatalog(currentCatalog, colorCode);
        if (colorInfo) {
            const darkenedColor = darkenColor(colorInfo.hex, 15);
            
            let tempEffectNote = '';
            if (isLightOn) {
                const tintedColor = applyTemperatureTint(darkenedColor, currentTemperature);
                tempEffectNote = `<div style="margin-top: 3px; font-size: 0.8rem; color: #6c757d;">
                    При текущем свете (${currentTemperature}K): ${tintedColor}
                </div>`;
            }
            
            colorNameContainer.innerHTML = `
                <div class="color-name-ru">${colorInfo.nameRu}</div>
                <div class="color-name-en">${colorInfo.nameEn}</div>
                <div style="margin-top: 5px; font-size: 0.85rem; color: #6c757d;">
                    Исходный: ${colorInfo.hex} → На стене: ${darkenedColor}
                </div>
                ${tempEffectNote}
            `;
        } else {
            colorNameContainer.innerHTML = '<div style="color: #999;">Цвет не найден в каталоге</div>';
        }
    }
    
    // Обновление HEX значения у цветовых пикеров
    function updateHexValues() {
        tvHex.textContent = tvColorPicker.value.toUpperCase();
        cabinetHex.textContent = cabinetColorPicker.value.toUpperCase();
        chestHex.textContent = chestColorPicker.value.toUpperCase();
        shelfHex.textContent = shelfColorPicker.value.toUpperCase();
        plantPotHex.textContent = plantPotColorPicker.value.toUpperCase();
        plantHex.textContent = plantColorPicker.value.toUpperCase();
    }
    
    // Функция для переключения света (вкл/выкл)
    function toggleLight() {
        if (isLightOn) {
            turnLightOff();
        } else {
            turnLightOn(currentTemperature);
        }
    }
    
    // Функция для выключения света
    function turnLightOff() {
        isLightOn = false;
        
        // Выключаем лампочку
        lightBulb.style.opacity = '0.3';
        lightBulb.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        lightBulb.style.backgroundColor = '#cccccc';
        
        // Убираем эффект освещения со стены
        mainWall.style.filter = 'brightness(0.9)';
        
        // Обновляем кнопку
        lightToggleBtn.textContent = '💡 Включить свет';
        lightToggleBtn.classList.remove('on');
        
        // Обновляем индикатор
        const lightStatus = document.getElementById('lightStatus');
        if (lightStatus) {
            lightStatus.className = 'light-status off';
            lightStatus.innerHTML = '🔌 Свет выключен';
        }
        
        updateStatus('Свет выключен. Цвет стен отображается без эффекта освещения.');
        
        // Обновляем информацию о цвете (без эффекта температуры)
        updateColorName();
    }
    
    // Функция для включения света
    function turnLightOn(temperature) {
        isLightOn = true;
        currentTemperature = temperature;
        
        // Включаем лампочку
        lightBulb.style.opacity = '1';
        
        // Применяем эффект освещения
        updateLighting(temperature);
        
        // Обновляем кнопку
        lightToggleBtn.textContent = '🔌 Выключить свет';
        lightToggleBtn.classList.add('on');
        
        // Обновляем индикатор
        const lightStatus = document.getElementById('lightStatus');
        if (lightStatus) {
            lightStatus.className = 'light-status on';
            lightStatus.innerHTML = `💡 Свет включен (${temperature}K)`;
        }
        
        updateStatus(`Свет включен: ${temperature}K`);
        
        // Обновляем информацию о цвете (с эффектом температуры)
        updateColorName();
    }
    
    // Обновление освещения на основе температуры
    function updateLighting(temperature) {
        temperature = Math.max(1000, Math.min(10000, temperature));
        currentTemperature = temperature;
        
        temperatureInput.value = temperature;
        tempValue.textContent = temperature;
        
        let bulbColor, bulbGlow, intensity;
        
        if (temperature < 3500) {
            if (temperature < 3000) {
                // Очень теплый (2700K - лампы накаливания)
                bulbColor = '#ffcc88';
                bulbGlow = '#ff9900';
                intensity = 1.1;
            } else {
                // Теплый (3000-3500K)
                bulbColor = '#ffdd99';
                bulbGlow = '#ffaa33';
                intensity = 1.05;
            }
        } else {
            if (temperature < 4500) {
                // Нейтральный (4000K - популярный для дома)
                bulbColor = '#ffffcc';
                bulbGlow = '#ffff66';
                intensity = 1.0;
            } else {
                // Холодный (4500K+)
                bulbColor = '#ccffff';
                bulbGlow = '#66ffff';
                intensity = 0.95;
            }
        }
        
        // Применяем цвет к лампочке
        lightBulb.style.backgroundColor = bulbColor;
        lightBulb.style.boxShadow = `0 0 25px ${bulbGlow}`;
        
        // Упрощенный эффект на стене
        mainWall.style.filter = `brightness(${intensity})`;
        
        // Обновляем индикатор
        const lightStatus = document.getElementById('lightStatus');
        if (lightStatus && isLightOn) {
            lightStatus.innerHTML = `💡 Свет включен (${temperature}K)`;
        }
        
        // Обновляем информацию о цвете
        updateColorName();
    }
    
    // ============================================
    // ФУНКЦИИ ДЛЯ СПЛИТ-СТЕНЫ И УПРАВЛЕНИЯ КОМНАТОЙ
    // ============================================
    
    // Функция создания секций стены
    function createWallSections() {
        const mainWall = document.getElementById('mainWall');
        
        // Удаляем существующие секции (если есть)
        const existingSections = mainWall.querySelectorAll('.wall-section');
        existingSections.forEach(section => section.remove());
        
        // Создаем 4 секции
        for (let i = 1; i <= 4; i++) {
            const section = document.createElement('div');
            section.className = `wall-section section-${i}`;
            section.dataset.section = i;
            section.style.backgroundColor = '#ffffff';
            
            // Убираем !important из стиля, чтобы можно было менять цвет
            if (i === 1) {
                section.classList.add('active');
            }
            
            mainWall.appendChild(section);
        }
        
        updateWallSections();
        updateSectionInfo();
    }
    
    // Функция обновления отображения секций
    function updateWallSections() {
        const wallSections = document.querySelectorAll('.wall-section');
        
        if (!wallSections.length) return;
        
        wallSections.forEach(section => {
            const sectionNum = parseInt(section.dataset.section);
            
            if (sectionNum <= splitMode) {
                section.style.display = 'block';
                
                const width = 100 / splitMode;
                const left = (sectionNum - 1) * width;
                
                section.style.width = `${width}%`;
                section.style.left = `${left}%`;
                
                // Добавляем границу между секциями
                if (sectionNum < splitMode) {
                    section.style.borderRight = '2px solid rgba(0, 0, 0, 0.1)';
                } else {
                    section.style.borderRight = 'none';
                }
            } else {
                section.style.display = 'none';
            }
        });
        
        // Показываем/скрываем элементы управления секциями
        if (splitMode > 1) {
            if (sectionSelector) sectionSelector.style.display = 'block';
            if (sectionInfo) sectionInfo.style.display = 'block';
        } else {
            if (sectionSelector) sectionSelector.style.display = 'none';
            if (sectionInfo) sectionInfo.style.display = 'none';
        }
    }
    
    // Функция обновления информации о секциях
    function updateSectionInfo() {
        if (currentSectionSpan) {
            currentSectionSpan.textContent = activeSection;
        }
        
        const wallSections = document.querySelectorAll('.wall-section');
        wallSections.forEach(section => {
            section.classList.remove('active');
            if (parseInt(section.dataset.section) === activeSection) {
                section.classList.add('active');
            }
        });
    }
    
    // Функция применения цвета стен с учетом секций
    function applyWallColorWithSections() {
        const colorCode = colorCodeInput.value.trim();
        
        if (!colorCode) {
            updateStatus('Введите код цвета');
            return;
        }
        
        const colorInfo = getColorFromCatalog(currentCatalog, colorCode);
        let baseColor, darkenedColor, finalColor;
        
        if (colorInfo) {
            baseColor = colorInfo.hex;
            darkenedColor = darkenColor(baseColor, 15);
            finalColor = darkenedColor;
            
            if (isLightOn) {
                finalColor = applyTemperatureTint(darkenedColor, currentTemperature);
            }
        } else if (/^#([0-9A-F]{3}){1,2}$/i.test(colorCode)) {
            baseColor = colorCode;
            darkenedColor = darkenColor(baseColor, 15);
            finalColor = darkenedColor;
            
            if (isLightOn) {
                finalColor = applyTemperatureTint(darkenedColor, currentTemperature);
            }
        } else {
            updateStatus(`Цвет ${colorCode} не найден. Введите другой код.`);
            return;
        }
        
        // Получаем или создаем секции стены
        let wallSections = document.querySelectorAll('.wall-section');
        
        if (wallSections.length === 0) {
            // Если секции не созданы, создаем их
            createWallSections();
            wallSections = document.querySelectorAll('.wall-section');
        }
        
        if (splitMode === 1) {
            // Если одна секция - красим всю стену
            wallSections.forEach(section => {
                if (parseInt(section.dataset.section) <= 4) {
                    section.style.backgroundColor = finalColor;
                }
            });
            updateStatus(`Цвет ${colorInfo ? colorInfo.nameRu : colorCode} применён ко всей стене`);
        } else {
            // Если несколько секций - красим только активную
            const activeSectionElement = document.querySelector(`.wall-section[data-section="${activeSection}"]`);
            if (activeSectionElement) {
                activeSectionElement.style.backgroundColor = finalColor;
                updateStatus(`Цвет ${colorInfo ? colorInfo.nameRu : colorCode} применён к секции ${activeSection}`);
            }
        }
        
        updateColorName();
    }
    
    // Инициализация управления комнатой
    function initRoomControls() {
        // Создаем секции стены при инициализации
        createWallSections();
        
        if (!toggleFurnitureBtn) return;
        
        // Кнопка скрытия мебели
        toggleFurnitureBtn.addEventListener('click', function() {
            isFurnitureVisible = !isFurnitureVisible;
            const room = document.querySelector('.room');
            const btnText = toggleFurnitureBtn.querySelector('.btn-text');
            const btnIcon = toggleFurnitureBtn.querySelector('.btn-icon');
            
            if (isFurnitureVisible) {
                room.classList.remove('furniture-hidden');
                btnText.textContent = 'Скрыть мебель';
                btnIcon.textContent = '🛋️';
                updateStatus('Мебель показана');
            } else {
                room.classList.add('furniture-hidden');
                btnText.textContent = 'Показать мебель';
                btnIcon.textContent = '👁️';
                updateStatus('Мебель скрыта');
            }
        });
        
        // Кнопка "Только стены"
        if (wallsOnlyBtn) {
            wallsOnlyBtn.addEventListener('click', function() {
                isWallsOnlyMode = !isWallsOnlyMode;
                const room = document.querySelector('.room');
                const btnText = wallsOnlyBtn.querySelector('.btn-text');
                const btnIcon = wallsOnlyBtn.querySelector('.btn-icon');
                
                if (isWallsOnlyMode) {
                    room.classList.add('walls-only-mode');
                    btnText.textContent = 'Вся комната';
                    btnIcon.textContent = '🏠';
                    updateStatus('Режим "Только стены"');
                } else {
                    room.classList.remove('walls-only-mode');
                    btnText.textContent = 'Только стены';
                    btnIcon.textContent = '🧱';
                    updateStatus('Вся комната');
                }
            });
        }
        
        // Кнопка сброса стен
        if (resetWallsBtn) {
            resetWallsBtn.addEventListener('click', function() {
                const wallSections = document.querySelectorAll('.wall-section');
                wallSections.forEach(section => {
                    section.style.backgroundColor = '#ffffff';
                });
                updateStatus('Цвета стен сброшены к белому');
            });
        }
        
        // Кнопки выбора количества секций
        if (splitButtons.length) {
            splitButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    splitMode = parseInt(this.dataset.split);
                    
                    splitButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    updateWallSections();
                    updateSectionInfo();
                    
                    updateStatus(`Стена разделена на ${splitMode} секций`);
                });
            });
        }
        
        // Кнопки выбора активной секции
        if (sectionButtons.length) {
            sectionButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    activeSection = parseInt(this.dataset.section);
                    
                    sectionButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    updateSectionInfo();
                    
                    updateStatus(`Активная секция: ${activeSection}`);
                });
            });
        }
    }
    
    // ============================================
    // ФУНКЦИИ ДЛЯ ПОДБОРА ЦВЕТОВ
    // ============================================
    
    // Конвертация HEX в RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    // Конвертация RGB в HSL
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    
    // Расчет цветового различия (упрощенная формула)
    function calculateColorDifference(color1, color2) {
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return 1000;
        
        const rDiff = Math.pow(rgb1.r - rgb2.r, 2);
        const gDiff = Math.pow(rgb1.g - rgb2.g, 2);
        const bDiff = Math.pow(rgb1.b - rgb2.b, 2);
        
        return Math.sqrt(rDiff + gDiff + bDiff);
    }
    
    // Подбор похожих цветов
    function findSimilarColors(baseColor, catalog) {
        const allColors = getAllColorsFromCatalog(catalog);
        const baseHex = baseColor.hex;
        
        const sortedColors = allColors
            .filter(color => color.code !== baseColor.code)
            .map(color => ({
                ...color,
                difference: calculateColorDifference(baseHex, color.hex)
            }))
            .sort((a, b) => a.difference - b.difference);
        
        return sortedColors.slice(0, 5);
    }
    
    // Подбор контрастных цветов
    function findContrastColors(baseColor, catalog) {
        const allColors = getAllColorsFromCatalog(catalog);
        const baseHex = baseColor.hex;
        const baseRgb = hexToRgb(baseHex);
        const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
        
        const sortedColors = allColors
            .filter(color => color.code !== baseColor.code)
            .map(color => {
                const colorRgb = hexToRgb(color.hex);
                const colorHsl = rgbToHsl(colorRgb.r, colorRgb.g, colorRgb.b);
                
                const lightnessDiff = Math.abs(baseHsl.l - colorHsl.l);
                const hueDiff = Math.min(
                    Math.abs(baseHsl.h - colorHsl.h),
                    360 - Math.abs(baseHsl.h - colorHsl.h)
                );
                
                const contrastScore = (lightnessDiff * 0.7) + (hueDiff * 0.3);
                
                return {
                    ...color,
                    contrastScore: contrastScore
                };
            })
            .sort((a, b) => b.contrastScore - a.contrastScore);
        
        return sortedColors.slice(0, 5);
    }
    
    // Подбор монохромных цветов
    function findMonochromeColors(baseColor, catalog) {
        const allColors = getAllColorsFromCatalog(catalog);
        const baseHex = baseColor.hex;
        const baseRgb = hexToRgb(baseHex);
        const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
        
        const sortedColors = allColors
            .filter(color => color.code !== baseColor.code)
            .map(color => {
                const colorRgb = hexToRgb(color.hex);
                const colorHsl = rgbToHsl(colorRgb.r, colorRgb.g, colorRgb.b);
                
                let hueDiff = Math.abs(baseHsl.h - colorHsl.h);
                hueDiff = Math.min(hueDiff, 360 - hueDiff);
                
                const lightnessDiff = Math.abs(baseHsl.l - colorHsl.l);
                
                const score = (hueDiff * 0.3) + (lightnessDiff * 0.7);
                
                return {
                    ...color,
                    hueDiff: hueDiff,
                    lightnessDiff: lightnessDiff,
                    score: score
                };
            })
            .filter(color => color.hueDiff < 30)
            .sort((a, b) => a.score - b.score);
        
        return sortedColors.slice(0, 5);
    }
    
    // Создание элемента цвета для отображения
    function createColorElement(colorInfo, isBase = false) {
        const colorElement = document.createElement('div');
        colorElement.className = `color-item ${isBase ? 'base-color' : ''}`;
        colorElement.title = `Кликните, чтобы применить цвет ${colorInfo.code}`;
        
        const darkenedColor = darkenColor(colorInfo.hex, 15);
        
        colorElement.innerHTML = `
            <div class="color-preview" style="background-color: ${darkenedColor};"></div>
            <div class="color-info">
                <div class="color-code">${colorInfo.code}</div>
                <div class="color-catalog">${currentPickerCatalog.toUpperCase()}</div>
            </div>
        `;
        
        colorElement.addEventListener('click', () => {
            // Устанавливаем значение в поле ввода
            if (colorCodeInput) {
                colorCodeInput.value = colorInfo.code;
            }
            
            // Устанавливаем текущий каталог
            currentCatalog = currentPickerCatalog;
            
            // Обновляем активные кнопки каталога
            catalogButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-catalog') === currentPickerCatalog) {
                    btn.classList.add('active');
                }
            });
            
            // Обновляем название цвета
            updateColorName();
            
            // Применяем цвет к стене
            applyWallColorWithSections();
        });
        
        return colorElement;
    }
    
    // Отображение подобранных цветов
    function displayPickedColors(colors, baseColor) {
        colorsGrid.innerHTML = '';
        
        if (!colors || colors.length === 0) {
            colorsGrid.innerHTML = '<div class="no-colors">Цвета не найдены</div>';
            return;
        }
        
        // Добавляем базовый цвет
        const baseColorElement = createColorElement(baseColor, true);
        colorsGrid.appendChild(baseColorElement);
        
        // Добавляем подобранные цвета
        colors.forEach(color => {
            const colorElement = createColorElement(color, false);
            colorsGrid.appendChild(colorElement);
        });
    }
    
    // Основная функция подбора цветов
    function pickColors() {
        const colorCode = colorPickerInput.value.trim();
        
        if (!colorCode) {
            updateStatus('Введите код цвета для подбора');
            return;
        }
        
        const baseColor = getColorFromCatalog(currentPickerCatalog, colorCode);
        
        if (!baseColor) {
            updateStatus(`Цвет ${colorCode} не найден в каталоге ${currentPickerCatalog.toUpperCase()}`);
            colorsGrid.innerHTML = '<div class="no-colors">Цвет не найден в каталоге</div>';
            return;
        }
        
        let pickedColors = [];
        
        switch (currentMode) {
            case 'similar':
                pickedColors = findSimilarColors(baseColor, currentPickerCatalog);
                updateStatus(`Подобраны похожие цвета для ${currentPickerCatalog.toUpperCase()} ${colorCode}`);
                break;
                
            case 'contrast':
                pickedColors = findContrastColors(baseColor, currentPickerCatalog);
                updateStatus(`Подобраны контрастные цвета для ${currentPickerCatalog.toUpperCase()} ${colorCode}`);
                break;
                
            case 'monochrome':
                pickedColors = findMonochromeColors(baseColor, currentPickerCatalog);
                updateStatus(`Подобраны монохромные цвета для ${currentPickerCatalog.toUpperCase()} ${colorCode}`);
                break;
                
            default:
                pickedColors = findSimilarColors(baseColor, currentPickerCatalog);
                updateStatus(`Подобраны похожие цвета для ${currentPickerCatalog.toUpperCase()} ${colorCode}`);
        }
        
        displayPickedColors(pickedColors, baseColor);
    }
    
    // Вспомогательная функция для получения всех цветов из каталога
    function getAllColorsFromCatalog(catalog) {
        const catalogData = colorDatabase[catalog];
        if (!catalogData) return [];
        
        return Object.keys(catalogData).map(code => ({
            code: code,
            hex: catalogData[code].hex,
            nameRu: catalogData[code].nameRu,
            nameEn: catalogData[code].nameEn
        }));
    }
    
    // ============================================
    // ИНИЦИАЛИЗАЦИЯ (основной код из твоего файла с дополнениями)
    // ============================================
    
    function initialize() {
        // Создаем индикатор состояния света
        createLightStatusIndicator();
        
        // Устанавливаем начальные значения
        mainWall.style.backgroundColor = initialValues.wallColor;
        updateHexValues();
        
        // Включаем свет с начальной температурой
        turnLightOn(initialValues.lightTemperature);
        
        // Обновляем название начального цвета
        updateColorName();
        
        // Настройка каталогов для выбора цвета стен
        catalogButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                catalogButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentCatalog = this.getAttribute('data-catalog');
                updateStatus(`Выбран каталог: ${currentCatalog.toUpperCase()}`);
                updateColorName();
            });
        });
        
        // Настройка каталогов для подбора цветов
        catalogPickerButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                catalogPickerButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentPickerCatalog = this.getAttribute('data-catalog');
                updateStatus(`Выбран каталог для подбора: ${currentPickerCatalog.toUpperCase()}`);
                // Автоматически подбираем цвета при смене каталога
                pickColors();
            });
        });
        
        // Настройка режимов подбора
        modeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                modeButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentMode = this.getAttribute('data-mode');
                updateStatus(`Режим подбора: ${this.textContent}`);
                // Автоматически подбираем цвета при смене режима
                pickColors();
            });
        });
        
        // Обработчики событий для кнопок температуры
        warmBtn.addEventListener('click', () => {
            turnLightOn(2700);
        });
        
        coldBtn.addEventListener('click', () => {
            turnLightOn(4000);
        });
        
        // Обработчик для кнопки переключателя света
        lightToggleBtn.addEventListener('click', () => {
            toggleLight();
        });
        
        // Обработчик изменения температуры ползунком
        temperatureInput.addEventListener('input', () => {
            const temp = parseInt(temperatureInput.value);
            if (!isNaN(temp)) {
                if (isLightOn) {
                    turnLightOn(temp);
                } else {
                    // Если свет выключен, только обновляем значение
                    temperatureInput.value = temp;
                    tempValue.textContent = temp;
                    currentTemperature = temp;
                }
            }
        });
        
        // Применение цвета стен
        applyWallColorBtn.addEventListener('click', applyWallColorWithSections);
        
        // Обработчик для клавиши Enter в поле ввода цвета
        colorCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyWallColorWithSections();
            }
        });
        
        // Обновление названия цвета при вводе
        colorCodeInput.addEventListener('input', () => {
            updateColorName();
        });
        
        // Подбор цветов
        pickColorsBtn.addEventListener('click', pickColors);
        
        // Обработчик для клавиши Enter в поле подбора цветов
        colorPickerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                pickColors();
            }
        });
        
        // Обработчики для выбора цвета мебели
        tvColorPicker.addEventListener('input', () => {
            tv.style.backgroundColor = tvColorPicker.value;
            updateHexValues();
            updateStatus(`Цвет телевизора изменен на ${tvColorPicker.value.toUpperCase()}`);
        });
        
        cabinetColorPicker.addEventListener('input', () => {
            cabinet.style.backgroundColor = cabinetColorPicker.value;
            const drawer = cabinet.querySelector('.cabinet-drawer');
            if (drawer) {
                // Немного темнее для ящика
                const darkerColor = darkenColor(cabinetColorPicker.value, 20);
                drawer.style.backgroundColor = darkerColor;
            }
            updateHexValues();
            updateStatus(`Цвет шкафа изменен на ${cabinetColorPicker.value.toUpperCase()}`);
        });
        
        chestColorPicker.addEventListener('input', () => {
            chest.style.backgroundColor = chestColorPicker.value;
            const drawer = chest.querySelector('.chest-drawer');
            if (drawer) {
                // Немного темнее для ящика
                const darkerColor = darkenColor(chestColorPicker.value, 20);
                drawer.style.backgroundColor = darkerColor;
            }
            updateHexValues();
            updateStatus(`Цвет комода изменен на ${chestColorPicker.value.toUpperCase()}`);
        });
        
        shelfColorPicker.addEventListener('input', () => {
            shelf.style.backgroundColor = shelfColorPicker.value;
            updateHexValues();
            updateStatus(`Цвет полки изменен на ${shelfColorPicker.value.toUpperCase()}`);
        });
        
        plantPotColorPicker.addEventListener('input', () => {
            const plantPot = plant.querySelector('.plant-pot');
            plantPot.style.backgroundColor = plantPotColorPicker.value;
            updateHexValues();
            updateStatus(`Цвет горшка растения изменен на ${plantPotColorPicker.value.toUpperCase()}`);
        });
        
        plantColorPicker.addEventListener('input', () => {
            const plantStem = plant.querySelector('.plant-stem');
            const plantLeaves = plant.querySelector('.plant-leaves');
            plantStem.style.backgroundColor = plantColorPicker.value;
            plantLeaves.style.backgroundColor = plantColorPicker.value;
            updateHexValues();
            updateStatus(`Цвет растения изменен на ${plantColorPicker.value.toUpperCase()}`);
        });
        
        // Кнопка сброса
        resetBtn.addEventListener('click', () => {
            // Сброс цвета стен
            const wallSections = document.querySelectorAll('.wall-section');
            if (wallSections.length > 0) {
                wallSections.forEach(section => {
                    section.style.backgroundColor = '#ffffff';
                });
            } else {
                mainWall.style.backgroundColor = '#ffffff';
            }
            
            // Сброс освещения
            turnLightOn(initialValues.lightTemperature);
            
            // Сброс цветов мебели
            tvColorPicker.value = initialValues.tvColor;
            tv.style.backgroundColor = initialValues.tvColor;
            
            cabinetColorPicker.value = initialValues.cabinetColor;
            cabinet.style.backgroundColor = initialValues.cabinetColor;
            const cabinetDrawer = cabinet.querySelector('.cabinet-drawer');
            if (cabinetDrawer) {
                cabinetDrawer.style.backgroundColor = '#A0522D';
            }
            
            chestColorPicker.value = initialValues.chestColor;
            chest.style.backgroundColor = initialValues.chestColor;
            const chestDrawer = chest.querySelector('.chest-drawer');
            if (chestDrawer) {
                chestDrawer.style.backgroundColor = '#7a4f1f';
            }
            
            shelfColorPicker.value = initialValues.shelfColor;
            shelf.style.backgroundColor = initialValues.shelfColor;
            
            plantPotColorPicker.value = initialValues.plantPotColor;
            plant.querySelector('.plant-pot').style.backgroundColor = initialValues.plantPotColor;
            
            plantColorPicker.value = initialValues.plantColor;
            plant.querySelector('.plant-stem').style.backgroundColor = initialValues.plantColor;
            plant.querySelector('.plant-leaves').style.backgroundColor = initialValues.plantColor;
            
            // Сброс каталога
            catalogButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-catalog') === 'ral') {
                    btn.classList.add('active');
                }
            });
            currentCatalog = 'ral';
            
            // Сброс каталога для подбора
            catalogPickerButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-catalog') === 'ral') {
                    btn.classList.add('active');
                }
            });
            currentPickerCatalog = 'ral';
            
            // Сброс режима подбора
            modeButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-mode') === 'similar') {
                    btn.classList.add('active');
                }
            });
            currentMode = 'similar';
            
            // Сброс кода цвета
            colorCodeInput.value = '9010';
            colorPickerInput.value = '9010';
            updateColorName();
            
            // Сброс результатов подбора
            colorsGrid.innerHTML = '';
            
            // Сброс сплит-стены
            splitMode = 1;
            activeSection = 1;
            
            // Обновляем UI сплит-стены
            document.querySelectorAll('.split-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.split === '1') {
                    btn.classList.add('active');
                }
            });
            
            document.querySelectorAll('.section-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.section === '1') {
                    btn.classList.add('active');
                }
            });
            
            // Обновляем отображение секций
            updateWallSections();
            updateSectionInfo();
            
            // Сброс режимов комнаты
            isFurnitureVisible = true;
            isWallsOnlyMode = false;
            const room = document.querySelector('.room');
            room.classList.remove('furniture-hidden', 'walls-only-mode');
            
            // Обновление текста кнопок
            const toggleBtnText = document.querySelector('#toggleFurnitureBtn .btn-text');
            const toggleBtnIcon = document.querySelector('#toggleFurnitureBtn .btn-icon');
            const wallsBtnText = document.querySelector('#wallsOnlyBtn .btn-text');
            const wallsBtnIcon = document.querySelector('#wallsOnlyBtn .btn-icon');
            
            if (toggleBtnText) toggleBtnText.textContent = 'Скрыть мебель';
            if (toggleBtnIcon) toggleBtnIcon.textContent = '🛋️';
            if (wallsBtnText) wallsBtnText.textContent = 'Только стены';
            if (wallsBtnIcon) wallsBtnIcon.textContent = '🧱';
            
            // Обновление HEX значений
            updateHexValues();
            
            updateStatus('Полный сброс к начальным значениям выполнен');
        });
        
        // Инициализация управления комнатой
        initRoomControls();
        
        // Инициализация статуса
        updateStatus('Готово к работе. Выберите параметры освещения и цвета.');
        
        // Автоматический подбор цветов при загрузке
        setTimeout(() => {
            pickColors();
        }, 500);
    }
    
    // Запуск инициализации
    initialize();
});