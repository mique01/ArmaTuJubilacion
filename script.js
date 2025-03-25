document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current tab
            this.classList.add('active');
            document.getElementById(this.dataset.tab + 'Tab').classList.add('active');
        });
    });
    
    // Smooth scroll for info links
    document.querySelectorAll('.more-info').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 20,
                behavior: 'smooth'
            });
        });
    });
    
    // Configure chart.js global settings for dark theme
    Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    
    // RETIREMENT CALCULATOR
    // Get DOM elements
    const form = document.getElementById('retirement-form');
    const initialAmount = document.getElementById('initialAmount');
    const contributionYears = document.getElementById('contributionYears');
    const monthlyContribution = document.getElementById('monthlyContribution');
    const annualRate = document.getElementById('annualRate');
    const retirementType = document.getElementById('retirementType');
    const retirementDuration = document.getElementById('retirementDuration');
    const retirementAmount = document.getElementById('retirementAmount');
    const targetFinalAmount = document.getElementById('targetFinalAmount');
    const decumulationRate = document.getElementById('decumulationRate');
    
    // Input groups
    const initialAmountGroup = document.getElementById('initialAmountGroup');
    const contributionYearsGroup = document.getElementById('contributionYearsGroup');
    const monthlyContributionGroup = document.getElementById('monthlyContributionGroup');
    const annualRateGroup = document.getElementById('annualRateGroup');
    const retirementDurationGroup = document.getElementById('retirementDurationGroup');
    const retirementAmountGroup = document.getElementById('retirementAmountGroup');
    const targetFinalAmountGroup = document.getElementById('targetFinalAmountGroup');
    const decumulationRateGroup = document.getElementById('decumulationRateGroup');
    
    // Result elements
    const finalAmountElement = document.getElementById('finalAmount');
    const calculatedInitialAmountElement = document.getElementById('calculatedInitialAmount');
    const calculatedMonthlyContributionElement = document.getElementById('calculatedMonthlyContribution');
    const annualWithdrawalElement = document.getElementById('annualWithdrawal');
    const retirementYearsElement = document.getElementById('retirementYears');
    
    // Result cards
    const finalAmountCard = document.getElementById('finalAmountCard');
    const annualWithdrawalCard = document.getElementById('annualWithdrawalCard');
    const retirementYearsCard = document.getElementById('retirementYearsCard');
    const initialAmountResultCard = document.getElementById('initialAmountResultCard');
    const monthlyContributionResultCard = document.getElementById('monthlyContributionResultCard');
    
    // Chart
    let retirementChart = null;
    
    // Initial setup
    setupRetirementForCalculationType('duration');
    
    // Handle retirement type change
    retirementType.addEventListener('change', function() {
        setupRetirementForCalculationType(this.value);
    });
    
    function setupRetirementForCalculationType(type) {
        // Hide all input fields and result cards first
        hideAllRetirementFields();
        hideAllRetirementCards();
        
        // Always show these fields
        contributionYearsGroup.classList.remove('hidden');
        annualRateGroup.classList.remove('hidden');
        finalAmountCard.classList.remove('hidden');
        
        // Show appropriate fields based on calculation type
        switch(type) {
            case 'duration':
                // Calculate withdrawal amount with fixed duration
                initialAmountGroup.classList.remove('hidden');
                monthlyContributionGroup.classList.remove('hidden');
                retirementDurationGroup.classList.remove('hidden');
                decumulationRateGroup.classList.remove('hidden');
                annualWithdrawalCard.classList.remove('hidden');
                break;
                
            case 'amount':
                // Calculate duration with fixed withdrawal amount
                initialAmountGroup.classList.remove('hidden');
                monthlyContributionGroup.classList.remove('hidden');
                retirementAmountGroup.classList.remove('hidden');
                decumulationRateGroup.classList.remove('hidden');
                retirementYearsCard.classList.remove('hidden');
                break;
                
            case 'initialAmount':
                // Calculate initial amount needed
                monthlyContributionGroup.classList.remove('hidden');
                retirementDurationGroup.classList.remove('hidden');
                retirementAmountGroup.classList.remove('hidden');
                decumulationRateGroup.classList.remove('hidden');
                initialAmountResultCard.classList.remove('hidden');
                break;
                
            case 'monthlyContribution':
                // Calculate monthly contribution needed
                initialAmountGroup.classList.remove('hidden');
                retirementDurationGroup.classList.remove('hidden');
                retirementAmountGroup.classList.remove('hidden');
                decumulationRateGroup.classList.remove('hidden');
                monthlyContributionResultCard.classList.remove('hidden');
                break;
        }
    }
    
    function hideAllRetirementFields() {
        // Hide all input groups
        initialAmountGroup.classList.add('hidden');
        contributionYearsGroup.classList.add('hidden');
        monthlyContributionGroup.classList.add('hidden');
        annualRateGroup.classList.add('hidden');
        retirementDurationGroup.classList.add('hidden');
        retirementAmountGroup.classList.add('hidden');
        targetFinalAmountGroup.classList.add('hidden');
        decumulationRateGroup.classList.add('hidden');
    }
    
    function hideAllRetirementCards() {
        // Hide all result cards
        finalAmountCard.classList.add('hidden');
        annualWithdrawalCard.classList.add('hidden');
        retirementYearsCard.classList.add('hidden');
        initialAmountResultCard.classList.add('hidden');
        monthlyContributionResultCard.classList.add('hidden');
    }
    
    // Calculate button event
    calculateButton.addEventListener('click', function() {
        calculateRetirement();
    });
    
    // Main calculation function
    function calculateRetirement() {
        // Get calculation type
        const calcType = retirementType.value;
        
        // Parse input values
        let PV = parseFloat(initialAmount.value) || 0;
        let n = parseInt(contributionYears.value) || 0;
        let PMT = (parseFloat(monthlyContribution.value) || 0) * 12; // Convert monthly to annual
        let r = (parseFloat(annualRate.value) || 0) / 100; // Convert percentage to decimal
        let withdrawalDuration = parseInt(retirementDuration.value) || 0;
        let withdrawalAmount = parseFloat(retirementAmount.value) || 0;
        let targetFV = parseFloat(targetFinalAmount.value) || 0;
        let decumulationRateValue = (parseFloat(decumulationRate.value) || parseFloat(annualRate.value) || 0) / 100; // Si no se especifica, usar la misma que acumulación
        
        let FV = 0;
        let calculatedPV = 0;
        let calculatedPMT = 0;
        
        // Perform calculations based on type
        switch(calcType) {
            case 'duration':
                // Calculate future value and annual withdrawal
                FV = calculateFutureValue(PV, PMT, r, n);
                const annualWithdrawal = calculateAnnualWithdrawal(FV, decumulationRateValue, withdrawalDuration);
                
                // Display results
                finalAmountElement.textContent = formatCurrency(FV);
                annualWithdrawalElement.textContent = formatCurrency(annualWithdrawal);
                
                // Create chart
                createRetirementChart(PV, PMT, r, n, FV, annualWithdrawal, withdrawalDuration, decumulationRateValue);
                break;
                
            case 'amount':
                // Calculate future value and withdrawal years
                FV = calculateFutureValue(PV, PMT, r, n);
                let withdrawalYears = calculateWithdrawalYears(FV, decumulationRateValue, withdrawalAmount);
                
                // Si el resultado es infinito o muy grande, mostrar como "Indefinido"
                if (!isFinite(withdrawalYears) || withdrawalYears > 150) {
                    retirementYearsElement.textContent = "Perpetuo";
                    // Usar un valor razonable para el gráfico
                    withdrawalYears = 50;
                } else {
                    retirementYearsElement.textContent = formatYears(withdrawalYears);
                }
                
                // Display results
                finalAmountElement.textContent = formatCurrency(FV);
                
                // Create chart
                createRetirementChart(PV, PMT, r, n, FV, withdrawalAmount, withdrawalYears, decumulationRateValue);
                break;
                
            case 'initialAmount':
                // Calcular el capital futuro necesario para los retiros
                FV = calculateFutureValueForWithdrawal(withdrawalAmount, decumulationRateValue, withdrawalDuration);
                
                // Calcular cuánto capital futuro podríamos alcanzar solo con aportes mensuales (sin capital inicial)
                const futureValueWithoutInitial = calculateFutureValue(0, PMT, r, n);
                
                // Si ya podemos alcanzar el capital necesario solo con aportes mensuales
                if (futureValueWithoutInitial >= FV) {
                    calculatedPV = 0;
                    calculatedInitialAmountElement.textContent = "No es necesario capital inicial";
                } else {
                    // Calcular el capital inicial necesario para llegar a FV considerando los aportes mensuales
                    // FV = PV * (1+r)^n + PMT * [(1+r)^n - 1] / r
                    // Por lo tanto: PV = [FV - PMT * ((1+r)^n - 1) / r] / (1+r)^n
                    const compoundFactor = Math.pow(1 + r, n);
                    const pmtContribution = PMT * (compoundFactor - 1) / r;
                    calculatedPV = Math.max(1, (FV - pmtContribution) / compoundFactor);
                    
                    calculatedInitialAmountElement.textContent = formatCurrency(calculatedPV);
                }
                
                // Calcular el capital final acumulado real
                const realFV = calculateFutureValue(calculatedPV, PMT, r, n);
                
                // Display results
                finalAmountElement.textContent = formatCurrency(realFV);
                
                // Create chart with calculated initial amount
                createRetirementChart(calculatedPV, PMT, r, n, FV, withdrawalAmount, withdrawalDuration, decumulationRateValue);
                break;
                
            case 'monthlyContribution':
                // If target final amount provided, use it, otherwise calculate from withdrawal needs
                if (targetFV > 0) {
                    FV = targetFV;
                } else {
                    FV = calculateFutureValueForWithdrawal(withdrawalAmount, decumulationRateValue, withdrawalDuration);
                }
                
                calculatedPMT = calculateRequiredMonthlyContribution(FV, PV, r, n);
                
                // Display results
                finalAmountElement.textContent = formatCurrency(FV);
                calculatedMonthlyContributionElement.textContent = formatCurrency(calculatedPMT / 12); // Convert annual to monthly
                
                // Create chart with calculated monthly contribution
                createRetirementChart(PV, calculatedPMT, r, n, FV, withdrawalAmount, withdrawalDuration, decumulationRateValue);
                break;
        }
    }
    
    // Calculate future value function (accumulation phase)
    function calculateFutureValue(PV, PMT, r, n) {
        // FV = PV × (1 + r)ⁿ + PMT × [(1 + r)ⁿ - 1] / r
        if (r === 0) {
            return PV + (PMT * n);
        }
        
        const compoundFactor = Math.pow(1 + r, n);
        return PV * compoundFactor + PMT * (compoundFactor - 1) / r;
    }
    
    // Calculate future value needed for a specific withdrawal
    function calculateFutureValueForWithdrawal(W, r, n) {
        // Verificar entradas válidas
        if (n <= 0 || W <= 0) return 0;
        
        // Si la tasa es cercana a cero, simplemente multiplicar
        if (r === 0 || Math.abs(r) < 0.0001) {
            return W * n;
        }
        
        // La fórmula correcta para el capital necesario para sostener retiros anuales de W durante n años con tasa r
        // Calcular el capital necesario al inicio del período de retiro para hacer retiradas de "W" durante "n" años
        // Esta es la fórmula de anualidad con pago al inicio del período
        return W * ((1 - Math.pow(1 + r, -n)) / r);
    }
    
    // Calculate initial amount needed
    function calculateRequiredInitialAmount(FV, PMT, r, n) {
        // PV = FV / (1 + r)ⁿ - PMT × [(1 + r)ⁿ - 1] / [r × (1 + r)ⁿ]
        if (n === 0) return FV; // Si no hay tiempo de acumulación, se necesita todo el capital objetivo
        
        if (r === 0) {
            const result = Math.max(0, FV - (PMT * n));
            return result === 0 ? 1 : result; // Evitar retornar 0 exactamente
        }
        
        const compoundFactor = Math.pow(1 + r, n);
        const result = Math.max(0, (FV - PMT * (compoundFactor - 1) / r) / compoundFactor);
        
        // Si el resultado es muy cercano a cero o negativo, devolver un valor mínimo positivo
        return result < 1 ? 1 : result;
    }
    
    // Calculate required monthly contribution
    function calculateRequiredMonthlyContribution(FV, PV, r, n) {
        // PMT = [FV - PV × (1 + r)ⁿ] × r / [(1 + r)ⁿ - 1]
        if (r === 0) {
            if (n === 0) return 0;
            return Math.max(0, (FV - PV) / n);
        }
        
        if (n === 0) return 0;
        
        const compoundFactor = Math.pow(1 + r, n);
        return Math.max(0, (FV - PV * compoundFactor) * r / (compoundFactor - 1));
    }
    
    // Calculate annual withdrawal (decumulation phase)
    function calculateAnnualWithdrawal(FV, r, n) {
        // W = FV × [r(1 + r)ⁿ / ((1 + r)ⁿ - 1)]
        if (r === 0 || n === 0) {
            return n > 0 ? FV / n : 0;
        }
        
        const compoundFactor = Math.pow(1 + r, n);
        return FV * (r * compoundFactor) / (compoundFactor - 1);
    }
    
    // Calculate withdrawal years
    function calculateWithdrawalYears(FV, r, W) {
        // Validar entradas
        if (W <= 0) return Infinity;
        
        // Si no hay interés o es muy bajo, usamos una aproximación simple
        if (r === 0 || r < 0.0001) {
            return FV / W;
        }
        
        // Si el interés anual es mayor que el retiro relativo al capital,
        // el capital nunca se agotará ya que los intereses superan al retiro
        const annualInterest = r * FV;
        if (annualInterest >= W) {
            return Infinity;
        }
        
        // Caso general: logaritmo del término necesario para agotar el capital
        const term = 1 - (r * FV / W);
        
        // Si el término es negativo o cero, el capital nunca se agotará
        if (term <= 0) {
            return Infinity;
        }
        
        return Math.max(0, -Math.log(term) / Math.log(1 + r));
    }
    
    // Create retirement chart function - Versión corregida
    function createRetirementChart(PV, PMT, r, contributionYears, FV, annualWithdrawal, withdrawalYears, decumulationR) {
        // Asegurarse de que tenemos un valor para la tasa de decumulación
        const decumulationRate = decumulationR !== undefined ? decumulationR : r;
        
        // Prepare data for accumulation phase (contribution years)
        const accumulationData = [];
        
        // Calcular el último valor de acumulación que será el valor futuro real
        const actualFV = calculateFutureValue(PV, PMT, r, contributionYears);
        
        for (let year = 0; year <= contributionYears; year++) {
            const value = calculateFutureValue(PV, PMT, r, year);
            accumulationData.push({
                x: year,
                y: Math.round(value)
            });
        }
        
        // Prepare data for decumulation phase (withdrawal years)
        const decumulationData = [];
        
        // Determinar duración máxima para la fase de decumulación
        let maxDecumulationYears = 30; // Valor por defecto
        
        // Si withdrawalYears es finito, usarlo como límite
        if (isFinite(withdrawalYears) && withdrawalYears > 0) {
            maxDecumulationYears = Math.min(Math.ceil(withdrawalYears + 1), 100);
        }
        
        // El primer punto de la fase de decumulación es el valor final acumulado real
        decumulationData.push({
            x: contributionYears,
            y: Math.round(actualFV)
        });
        
        // Simular la decumulación año a año con precisión
        let remainingCapital = actualFV;
        
        for (let year = 1; year <= maxDecumulationYears; year++) {
            // Si se está calculando el retiro anual fijo (caso duration), usar el valor calculado
            // Si se está calculando otra cosa, usar el valor del parámetro directamente
            const withdrawalForYear = annualWithdrawal;
            
            // Restar el retiro anual
            remainingCapital = remainingCapital - withdrawalForYear;
            
            // Si el capital se agotó, mostrar como cero y terminar
            if (remainingCapital <= 0) {
                decumulationData.push({
                    x: contributionYears + year,
                    y: 0
                });
                break;
            }
            
            // Aplicar interés usando la tasa de decumulación
            remainingCapital = remainingCapital * (1 + decumulationRate);
            
            // Agregar punto al gráfico
            decumulationData.push({
                x: contributionYears + year,
                y: Math.round(remainingCapital)
            });
        }
        
        // Destroy previous chart if it exists
        if (retirementChart) {
            retirementChart.destroy();
        }
        
        // Create a new chart
        const ctx = document.getElementById('retirementChart').getContext('2d');
        retirementChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Fase de Acumulación',
                        data: accumulationData,
                        borderColor: '#3d8af7',
                        backgroundColor: 'rgba(61, 138, 247, 0.1)',
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        tension: 0.1
                    },
                    {
                        label: 'Fase de Decumulación',
                        data: decumulationData,
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Años'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Capital (USD)'
                        },
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',  // Cambiado de 'index' a 'nearest' para mejor control
                    intersect: false
                },
                plugins: {
                    tooltip: {
                        filter: function(tooltipItem) {
                            // Filtrar los tooltips para mostrar solo la fase correcta según el año
                            const datasetIndex = tooltipItem.datasetIndex;
                            const year = tooltipItem.parsed.x;
                            
                            // Para dataset de acumulación (index 0), solo mostrar si el año es <= contributionYears
                            if (datasetIndex === 0 && year > contributionYears) {
                                return false;
                            }
                            
                            // Para dataset de decumulación (index 1), solo mostrar si el año es >= contributionYears
                            if (datasetIndex === 1 && year < contributionYears) {
                                return false;
                            }
                            
                            return true;
                        },
                        callbacks: {
                            label: function(context) {
                                const datasetLabel = context.dataset.label;
                                const value = context.parsed.y;
                                return datasetLabel + ': ' + formatCurrency(value);
                            },
                            title: function(context) {
                                return 'Año ' + context[0].parsed.x;
                            },
                            // Función adicional para personalizar el tooltip completo
                            afterLabel: function(context) {
                                const year = context.parsed.x;
                                const datasetIndex = context.datasetIndex;
                                
                                // Añadir información adicional relevante según la fase
                                if (datasetIndex === 0 && year <= contributionYears) {
                                    // Información adicional para fase de acumulación
                                    const yearsLeft = contributionYears - year;
                                    if (year === contributionYears) {
                                        return 'Fase de Acumulación: ' + formatCurrency(value) + '\nÚltimo año de aporte';
                                    }
                                    return yearsLeft > 0 ? 
                                          'Te faltan ' + yearsLeft + (yearsLeft === 1 ? ' año' : ' años') + ' de aporte' 
                                        : 'Último año de aporte';
                                }
                                
                                if (datasetIndex === 1 && year >= contributionYears) {
                                    // Información adicional para fase de decumulación
                                    const retirementYear = year - contributionYears;
                                    return retirementYear === 0 ? 
                                          'Inicio del retiro' 
                                        : 'Año ' + retirementYear + ' de retiro';
                                }
                                
                                return '';
                            }
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: true
                    },
                    // Agregar un plugin personalizado para dibujar una línea vertical en el año de transición
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                xMin: contributionYears,
                                xMax: contributionYears,
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                borderWidth: 2,
                                borderDash: [5, 5],
                                label: {
                                    content: 'Inicio del Retiro',
                                    display: true,
                                    position: 'top'
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    
    // SAVINGS CALCULATOR
    // Get DOM elements for savings calculator
    const savingsForm = document.getElementById('savings-form');
    const savingsCalculationType = document.getElementById('savingsCalculationType');
    const savingsInitialAmount = document.getElementById('savingsInitialAmount');
    const savingsMonthlyContribution = document.getElementById('savingsMonthlyContribution');
    const savingsYears = document.getElementById('savingsYears');
    const savingsRate = document.getElementById('savingsRate');
    const savingsGoal = document.getElementById('savingsGoal');
    const calculateSavingsButton = document.getElementById('calculateSavingsButton');
    
    // Input groups for savings calculator
    const savingsInitialAmountGroup = document.getElementById('savingsInitialAmountGroup');
    const savingsMonthlyContributionGroup = document.getElementById('savingsMonthlyContributionGroup');
    const savingsYearsGroup = document.getElementById('savingsYearsGroup');
    const savingsRateGroup = document.getElementById('savingsRateGroup');
    const savingsGoalGroup = document.getElementById('savingsGoalGroup');
    
    // Result elements for savings
    const savingsFinalAmount = document.getElementById('savingsFinalAmount');
    const savingsRequiredInitial = document.getElementById('savingsRequiredInitial');
    const savingsRequiredContribution = document.getElementById('savingsRequiredContribution');
    const timeToGoal = document.getElementById('timeToGoal');
    const interestEarned = document.getElementById('interestEarned');
    
    // Result cards for savings
    const savingsFinalAmountCard = document.getElementById('savingsFinalAmountCard');
    const savingsRequiredInitialCard = document.getElementById('savingsRequiredInitialCard');
    const savingsRequiredContributionCard = document.getElementById('savingsRequiredContributionCard');
    const timeToGoalCard = document.getElementById('timeToGoalCard');
    const interestEarnedCard = document.getElementById('interestEarnedCard');
    
    // Chart
    let savingsChart = null;
    
    // Initial setup for savings
    setupSavingsForCalculationType('futureValue');
    
    // Handle savings calculation type change
    savingsCalculationType.addEventListener('change', function() {
        setupSavingsForCalculationType(this.value);
    });
    
    function setupSavingsForCalculationType(type) {
        // Hide all input fields and result cards first
        hideAllSavingsFields();
        hideAllSavingsCards();
        
        // Always show interest rate
        savingsRateGroup.classList.remove('hidden');
        interestEarnedCard.classList.remove('hidden');
        
        // Show appropriate fields and cards based on calculation type
        switch(type) {
            case 'futureValue':
                // Calculate future value of savings
                savingsInitialAmountGroup.classList.remove('hidden');
                savingsMonthlyContributionGroup.classList.remove('hidden');
                savingsYearsGroup.classList.remove('hidden');
                savingsFinalAmountCard.classList.remove('hidden');
                break;
                
            case 'initialAmount':
                // Calculate required initial amount
                savingsMonthlyContributionGroup.classList.remove('hidden');
                savingsYearsGroup.classList.remove('hidden');
                savingsGoalGroup.classList.remove('hidden');
                savingsRequiredInitialCard.classList.remove('hidden');
                break;
                
            case 'monthlyContribution':
                // Calculate required monthly contribution
                savingsInitialAmountGroup.classList.remove('hidden');
                savingsYearsGroup.classList.remove('hidden');
                savingsGoalGroup.classList.remove('hidden');
                savingsRequiredContributionCard.classList.remove('hidden');
                break;
                
            case 'timeToGoal':
                // Calculate time to reach goal
                savingsInitialAmountGroup.classList.remove('hidden');
                savingsMonthlyContributionGroup.classList.remove('hidden');
                savingsGoalGroup.classList.remove('hidden');
                timeToGoalCard.classList.remove('hidden');
                break;
        }
    }
    
    function hideAllSavingsFields() {
        // Hide all input groups
        savingsInitialAmountGroup.classList.add('hidden');
        savingsMonthlyContributionGroup.classList.add('hidden');
        savingsYearsGroup.classList.add('hidden');
        savingsRateGroup.classList.add('hidden');
        savingsGoalGroup.classList.add('hidden');
    }
    
    function hideAllSavingsCards() {
        // Hide all result cards
        savingsFinalAmountCard.classList.add('hidden');
        savingsRequiredInitialCard.classList.add('hidden');
        savingsRequiredContributionCard.classList.add('hidden');
        timeToGoalCard.classList.add('hidden');
        interestEarnedCard.classList.add('hidden');
    }
    
    // Calculate button event for savings
    calculateSavingsButton.addEventListener('click', function() {
        calculateSavings();
    });
    
    // Main calculation function for savings
    function calculateSavings() {
        // Get calculation type
        const calcType = savingsCalculationType.value;
        
        // Parse input values
        let initialAmount = parseFloat(savingsInitialAmount.value) || 0;
        let monthlyContribution = parseFloat(savingsMonthlyContribution.value) || 0;
        let years = parseInt(savingsYears.value) || 0;
        let rate = (parseFloat(savingsRate.value) || 0) / 100;
        let goal = parseFloat(savingsGoal.value) || 0;
        
        let finalAmount = 0;
        let requiredInitial = 0;
        let requiredContribution = 0;
        let yearsToGoal = 0;
        let interestEarnedValue = 0;
        
        // Perform calculations based on type
        switch(calcType) {
            case 'futureValue':
                // Calculate future value
                finalAmount = calculateSavingsFutureValue(initialAmount, monthlyContribution, rate, years);
                
                // Calculate interest earned
                const totalContributions = initialAmount + (monthlyContribution * 12 * years);
                interestEarnedValue = finalAmount - totalContributions;
                
                // Display results
                savingsFinalAmount.textContent = formatCurrency(finalAmount);
                interestEarned.textContent = formatCurrency(interestEarnedValue);
                
                // Create chart
                createSavingsChart(initialAmount, monthlyContribution, rate, years, 0, 0);
                break;
                
            case 'initialAmount':
                // Calculate required initial amount
                requiredInitial = calculateSavingsRequiredInitialAmount(goal, monthlyContribution, rate, years);
                finalAmount = goal;
                
                // Calculate interest earned
                const totalWithRequiredInitial = requiredInitial + (monthlyContribution * 12 * years);
                interestEarnedValue = finalAmount - totalWithRequiredInitial;
                
                // Display results
                savingsRequiredInitial.textContent = formatCurrency(requiredInitial);
                interestEarned.textContent = formatCurrency(interestEarnedValue);
                
                // Create chart
                createSavingsChart(requiredInitial, monthlyContribution, rate, years, goal, 0);
                break;
                
            case 'monthlyContribution':
                // Calculate required monthly contribution
                requiredContribution = calculateSavingsRequiredMonthlyContribution(goal, initialAmount, rate, years);
                finalAmount = goal;
                
                // Calculate interest earned
                const totalWithRequiredContribution = initialAmount + (requiredContribution * 12 * years);
                interestEarnedValue = finalAmount - totalWithRequiredContribution;
                
                // Display results
                savingsRequiredContribution.textContent = formatCurrency(requiredContribution);
                interestEarned.textContent = formatCurrency(interestEarnedValue);
                
                // Create chart
                createSavingsChart(initialAmount, requiredContribution, rate, years, goal, 0);
                break;
                
            case 'timeToGoal':
                // Calculate time to reach goal
                yearsToGoal = calculateSavingsYearsToReachGoal(initialAmount, monthlyContribution, rate, goal);
                finalAmount = goal;
                
                // Calculate interest earned
                const totalContributionsToGoal = initialAmount + (monthlyContribution * 12 * yearsToGoal);
                interestEarnedValue = finalAmount - totalContributionsToGoal;
                
                // Display results
                timeToGoal.textContent = formatYears(yearsToGoal);
                interestEarned.textContent = formatCurrency(interestEarnedValue);
                
                // Create chart
                createSavingsChart(initialAmount, monthlyContribution, rate, yearsToGoal, goal, yearsToGoal);
                break;
        }
    }
    
    // Calculate future value for savings
    function calculateSavingsFutureValue(initialAmount, monthlyContribution, rate, years) {
        // FV = PV × (1 + r)ⁿ + PMT × [(1 + r)ⁿ - 1] / r
        const annualContribution = monthlyContribution * 12;
        
        if (rate === 0) {
            return initialAmount + (annualContribution * years);
        }
        
        const compoundFactor = Math.pow(1 + rate, years);
        return initialAmount * compoundFactor + annualContribution * (compoundFactor - 1) / rate;
    }
    
    // Calculate required initial amount for savings goal
    function calculateSavingsRequiredInitialAmount(goal, monthlyContribution, rate, years) {
        // PV = FV / (1 + r)ⁿ - PMT × [(1 + r)ⁿ - 1] / [r × (1 + r)ⁿ]
        const annualContribution = monthlyContribution * 12;
        
        if (rate === 0) {
            return Math.max(0, goal - (annualContribution * years));
        }
        
        const compoundFactor = Math.pow(1 + rate, years);
        return Math.max(0, (goal - annualContribution * (compoundFactor - 1) / rate) / compoundFactor);
    }
    
    // Calculate required monthly contribution for savings goal
    function calculateSavingsRequiredMonthlyContribution(goal, initialAmount, rate, years) {
        // PMT = [FV - PV × (1 + r)ⁿ] × r / [(1 + r)ⁿ - 1] / 12
        if (years === 0) return 0;
        
        if (rate === 0) {
            return Math.max(0, (goal - initialAmount) / (years * 12));
        }
        
        const compoundFactor = Math.pow(1 + rate, years);
        const annualContribution = Math.max(0, (goal - initialAmount * compoundFactor) * rate / (compoundFactor - 1));
        
        // Convert to monthly
        return annualContribution / 12;
    }
    
    // Calculate years to reach savings goal
    function calculateSavingsYearsToReachGoal(initialAmount, monthlyContribution, rate, goal) {
        // If goal is already reached or no positive contributions, return special values
        if (initialAmount >= goal) return 0;
        if (monthlyContribution <= 0 && rate <= 0) return Infinity;
        
        // If no interest, simple calculation
        if (rate === 0) {
            return (goal - initialAmount) / (monthlyContribution * 12);
        }
        
        // If no contributions, logarithmic formula
        if (monthlyContribution === 0) {
            return Math.log(goal / initialAmount) / Math.log(1 + rate);
        }
        
        // Use numerical approximation for general case
        const annualContribution = monthlyContribution * 12;
        let years = 0;
        let balance = initialAmount;
        
        while (balance < goal && years < 100) {
            balance = balance * (1 + rate) + annualContribution;
            years++;
        }
        
        return years;
    }
    
    // Create savings chart
    function createSavingsChart(initialAmount, monthlyContribution, rate, years, goal, yearsToGoal) {
        // Prepare data for savings growth
        const savingsData = [];
        const contributionsData = [];
        const goalLine = [];
        
        // Determine max years to show on chart
        const maxYears = Math.max(years, Math.min(isFinite(yearsToGoal) ? Math.ceil(yearsToGoal) : years, 50));
        
        // Calculate data points
        let totalContribution = initialAmount;
        
        for (let year = 0; year <= maxYears; year++) {
            // Calculate savings at this point
            const savingsValue = calculateSavingsFutureValue(initialAmount, monthlyContribution, rate, year);
            
            // Calculate total contributions at this point
            if (year > 0) {
                totalContribution += monthlyContribution * 12;
            }
            
            // Add data points
            savingsData.push({
                x: year,
                y: Math.round(savingsValue)
            });
            
            contributionsData.push({
                x: year,
                y: Math.round(totalContribution)
            });
            
            // Add goal line if applicable
            if (goal > 0) {
                goalLine.push({
                    x: year,
                    y: goal
                });
            }
        }
        
        // Destroy previous chart if it exists
        if (savingsChart) {
            savingsChart.destroy();
        }
        
        // Create a new chart
        const ctx = document.getElementById('savingsChart').getContext('2d');
        savingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Ahorros Totales',
                        data: savingsData,
                        borderColor: '#3d8af7',
                        backgroundColor: 'rgba(61, 138, 247, 0.1)',
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        tension: 0.1
                    },
                    {
                        label: 'Aportes Acumulados',
                        data: contributionsData,
                        borderColor: '#64c7ff',
                        backgroundColor: 'rgba(100, 199, 255, 0.1)',
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        tension: 0.1
                    },
                    ...(goal > 0 ? [{
                        label: 'Meta de Ahorro',
                        data: goalLine,
                        borderColor: '#4ecca3',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0,
                        pointHoverRadius: 0
                    }] : [])
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Años'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Capital (USD)'
                        },
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                            },
                            title: function(context) {
                                return 'Año ' + context[0].parsed.x;
                            }
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1
                    }
                }
            }
        });
    }
    
    // Add event listeners for real-time calculations when values change
    const retirementInputs = [
        initialAmount, 
        contributionYears, 
        monthlyContribution, 
        annualRate, 
        retirementDuration, 
        retirementAmount, 
        targetFinalAmount,
        decumulationRate
    ];
    
    retirementInputs.forEach(element => {
        if (element) {
            element.addEventListener('input', debounce(calculateRetirement, 300));
        }
    });
    
    retirementType.addEventListener('change', debounce(calculateRetirement, 100));
    
    const savingsInputs = [
        savingsInitialAmount, 
        savingsMonthlyContribution, 
        savingsYears, 
        savingsRate, 
        savingsGoal
    ];
    
    savingsInputs.forEach(element => {
        if (element) {
            element.addEventListener('input', debounce(calculateSavings, 300));
        }
    });
    
    savingsCalculationType.addEventListener('change', debounce(calculateSavings, 100));
    
    // Debounce function to limit calculation frequency
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Trigger initial calculations
    calculateRetirement();
    calculateSavings();
    
    // Format functions with consistent styles
    function formatCurrency(value) {
        // Verificar si el valor es válido
        if (!isFinite(value) || isNaN(value) || value === null) {
            return "$0";
        }
        
        // Si el valor es muy pequeño, mostrar un valor mínimo
        if (value < 1) {
            return "$1";
        }
        
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    }
    
    function formatYears(years) {
        // Verificar si el valor es válido
        if (!isFinite(years) || isNaN(years) || years === null) {
            return "Perpetuo";
        }
        
        // Si el valor es muy grande, mostrar como perpetuo
        if (years > 150) {
            return "Perpetuo";
        }
        
        if (years < 1) {
            const months = Math.round(years * 12);
            return months + (months === 1 ? ' mes' : ' meses');
        }
        
        // Redondear a 1 decimal para mejor visualización
        return years.toFixed(1) + ' años';
    }
}); 