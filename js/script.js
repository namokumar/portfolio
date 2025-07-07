// Hamburger menu functionality
window.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const body = document.body;
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            body.classList.toggle('menu-open');
        });
    }
    // Optional: Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('menu-open')) {
                body.classList.remove('menu-open');
            }
        });
    });
});

// Infinite logo marquee functionality
document.addEventListener('DOMContentLoaded', () => {
    const marquee = document.querySelector('.logo-marquee');
    if (marquee) {
        // Clone all items to create a seamless loop
        const originalItems = marquee.querySelectorAll('.logo-item');
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            marquee.appendChild(clone);
        });

        // To make it extra smooth, we can even add a second copy
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            marquee.appendChild(clone);
        });
    }

    // Contact form functionality
    const purposeSelect = document.getElementById('purpose');
    const otherPurposeDiv = document.getElementById('other-purpose');
    const otherPurposeInput = document.querySelector('input[name="other_purpose"]');

    if (purposeSelect && otherPurposeDiv && otherPurposeInput) {
        purposeSelect.addEventListener('change', function() {
            if (this.value === 'Other') {
                otherPurposeDiv.classList.remove('hidden');
                otherPurposeInput.required = true;
            } else {
                otherPurposeDiv.classList.add('hidden');
                otherPurposeInput.required = false;
                otherPurposeInput.value = '';
            }
        });
    }

    // Phone number country code detection
    const phoneInput = document.querySelector('input[name="phone"]');
    const countrySelect = document.querySelector('select[name="country"]');

    // Country code mapping
    const countryCodes = {
        '91': 'India',
        '1': 'United States',
        '1': 'Canada', // Note: US and Canada share +1, will default to US
        '44': 'United Kingdom',
        '61': 'Australia',
        '49': 'Germany',
        '33': 'France',
        '31': 'Netherlands',
        '65': 'Singapore',
        '971': 'UAE',
        '86': 'China',
        '81': 'Japan',
        '82': 'South Korea',
        '55': 'Brazil',
        '52': 'Mexico',
        '34': 'Spain',
        '39': 'Italy',
        '46': 'Sweden',
        '47': 'Norway',
        '45': 'Denmark',
        '358': 'Finland',
        '48': 'Poland',
        '420': 'Czech Republic',
        '36': 'Hungary',
        '40': 'Romania',
        '380': 'Ukraine',
        '7': 'Russia',
        '90': 'Turkey',
        '966': 'Saudi Arabia',
        '20': 'Egypt',
        '27': 'South Africa',
        '234': 'Nigeria',
        '254': 'Kenya',
        '256': 'Uganda',
        '233': 'Ghana',
        '237': 'Cameroon',
        '225': 'Ivory Coast',
        '221': 'Senegal',
        '212': 'Morocco',
        '216': 'Tunisia',
        '213': 'Algeria',
        '218': 'Libya',
        '249': 'Sudan',
        '251': 'Ethiopia',
        '252': 'Somalia',
        '253': 'Djibouti',
        '255': 'Tanzania',
        '256': 'Uganda',
        '257': 'Burundi',
        '258': 'Mozambique',
        '260': 'Zambia',
        '261': 'Madagascar',
        '262': 'Reunion',
        '263': 'Zimbabwe',
        '264': 'Namibia',
        '265': 'Malawi',
        '266': 'Lesotho',
        '267': 'Botswana',
        '268': 'Swaziland',
        '269': 'Comoros',
        '290': 'Saint Helena',
        '291': 'Eritrea',
        '297': 'Aruba',
        '298': 'Faroe Islands',
        '299': 'Greenland',
        '350': 'Gibraltar',
        '351': 'Portugal',
        '352': 'Luxembourg',
        '353': 'Ireland',
        '354': 'Iceland',
        '355': 'Albania',
        '356': 'Malta',
        '357': 'Cyprus',
        '358': 'Finland',
        '359': 'Bulgaria',
        '370': 'Lithuania',
        '371': 'Latvia',
        '372': 'Estonia',
        '373': 'Moldova',
        '374': 'Armenia',
        '375': 'Belarus',
        '376': 'Andorra',
        '377': 'Monaco',
        '378': 'San Marino',
        '379': 'Vatican City',
        '380': 'Ukraine',
        '381': 'Serbia',
        '382': 'Montenegro',
        '383': 'Kosovo',
        '385': 'Croatia',
        '386': 'Slovenia',
        '387': 'Bosnia and Herzegovina',
        '389': 'Macedonia',
        '420': 'Czech Republic',
        '421': 'Slovakia',
        '423': 'Liechtenstein',
        '501': 'Belize',
        '502': 'Guatemala',
        '503': 'El Salvador',
        '504': 'Honduras',
        '505': 'Nicaragua',
        '506': 'Costa Rica',
        '507': 'Panama',
        '508': 'Saint Pierre and Miquelon',
        '509': 'Haiti',
        '590': 'Guadeloupe',
        '591': 'Bolivia',
        '592': 'Guyana',
        '593': 'Ecuador',
        '594': 'French Guiana',
        '595': 'Paraguay',
        '596': 'Martinique',
        '597': 'Suriname',
        '598': 'Uruguay',
        '599': 'Netherlands Antilles',
        '670': 'East Timor',
        '671': 'Guam',
        '672': 'Australia',
        '673': 'Brunei',
        '674': 'Nauru',
        '675': 'Papua New Guinea',
        '676': 'Tonga',
        '677': 'Solomon Islands',
        '678': 'Vanuatu',
        '679': 'Fiji',
        '680': 'Palau',
        '681': 'Wallis and Futuna',
        '682': 'Cook Islands',
        '683': 'Niue',
        '685': 'Samoa',
        '686': 'Kiribati',
        '687': 'New Caledonia',
        '688': 'Tuvalu',
        '689': 'French Polynesia',
        '690': 'Tokelau',
        '691': 'Micronesia',
        '692': 'Marshall Islands',
        '850': 'North Korea',
        '852': 'Hong Kong',
        '853': 'Macau',
        '855': 'Cambodia',
        '856': 'Laos',
        '880': 'Bangladesh',
        '886': 'Taiwan',
        '960': 'Maldives',
        '961': 'Lebanon',
        '962': 'Jordan',
        '963': 'Syria',
        '964': 'Iraq',
        '965': 'Kuwait',
        '966': 'Saudi Arabia',
        '967': 'Yemen',
        '968': 'Oman',
        '970': 'Palestine',
        '971': 'UAE',
        '972': 'Israel',
        '973': 'Bahrain',
        '974': 'Qatar',
        '975': 'Bhutan',
        '976': 'Mongolia',
        '977': 'Nepal',
        '978': 'Abkhazia',
        '979': 'International Premium Rate Service',
        '992': 'Tajikistan',
        '993': 'Turkmenistan',
        '994': 'Azerbaijan',
        '995': 'Georgia',
        '996': 'Kyrgyzstan',
        '998': 'Uzbekistan',
        '1242': 'Bahamas',
        '1246': 'Barbados',
        '1264': 'Anguilla',
        '1268': 'Antigua and Barbuda',
        '1284': 'British Virgin Islands',
        '1340': 'U.S. Virgin Islands',
        '1345': 'Cayman Islands',
        '1441': 'Bermuda',
        '1473': 'Grenada',
        '1649': 'Turks and Caicos Islands',
        '1664': 'Montserrat',
        '1671': 'Guam',
        '1684': 'American Samoa',
        '1758': 'Saint Lucia',
        '1767': 'Dominica',
        '1784': 'Saint Vincent and the Grenadines',
        '1787': 'Puerto Rico',
        '1809': 'Dominican Republic',
        '1868': 'Trinidad and Tobago',
        '1869': 'Saint Kitts and Nevis',
        '1876': 'Jamaica',
        '1877': 'Caribbean',
        '1939': 'Puerto Rico'
    };

    if (phoneInput && countrySelect) {
        phoneInput.addEventListener('blur', function() {
            const phoneNumber = this.value.trim();
            
            // Check if phone number starts with + or has country code
            if (phoneNumber && (phoneNumber.startsWith('+') || phoneNumber.startsWith('00'))) {
                // Extract country code
                let countryCode = '';
                if (phoneNumber.startsWith('+')) {
                    countryCode = phoneNumber.substring(1);
                } else if (phoneNumber.startsWith('00')) {
                    countryCode = phoneNumber.substring(2);
                }
                
                // Try to find the country code (check for 1-4 digit codes)
                let foundCountry = null;
                let validCode = '';
                
                // Check for exact matches first (longer codes take priority)
                for (let i = 4; i >= 1; i--) {
                    const code = countryCode.substring(0, i);
                    if (countryCodes[code]) {
                        foundCountry = countryCodes[code];
                        validCode = code;
                        break;
                    }
                }
                
                // Additional validation: ensure the phone number has enough digits after country code
                if (foundCountry && countryCode.length > validCode.length) {
                    const remainingDigits = countryCode.substring(validCode.length).replace(/\D/g, '');
                    if (remainingDigits.length < 7) { // Most phone numbers need at least 7 digits
                        foundCountry = null;
                    }
                }
                
                if (foundCountry) {
                    // Set the country in the dropdown
                    countrySelect.value = foundCountry;
                    phoneInput.classList.remove('border-red-500');
                    phoneInput.classList.add('border-green-500');
                } else {
                    // Country code not found or invalid format
                    phoneInput.classList.remove('border-green-500');
                    phoneInput.classList.add('border-red-500');
                    alert('Please enter a valid phone number with country code (e.g., +1 9876543210). Make sure the country code is valid and the number has at least 7 digits.');
                    phoneInput.focus();
                }
            } else if (phoneNumber && !phoneNumber.startsWith('+') && !phoneNumber.startsWith('00')) {
                // No country code provided
                phoneInput.classList.remove('border-green-500');
                phoneInput.classList.add('border-red-500');
                alert('Please include country code in your phone number (e.g., +1 9876543210)');
                phoneInput.focus();
            } else {
                // Clear validation styling
                phoneInput.classList.remove('border-red-500', 'border-green-500');
            }
        });

        // Clear validation styling on input
        phoneInput.addEventListener('input', function() {
            this.classList.remove('border-red-500', 'border-green-500');
        });

        // Prevent form submission if phone number is invalid
        const contactForm = document.querySelector('form[action*="formspree"]');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                const phoneValue = phoneInput.value.trim();
                const countryValue = countrySelect.value;
                
                // Check if phone number has country code
                if (phoneValue && (!phoneValue.startsWith('+') && !phoneValue.startsWith('00'))) {
                    e.preventDefault();
                    alert('Please include country code in your phone number (e.g., +1 9876543210)');
                    phoneInput.focus();
                    return false;
                }
                
                // Check if country is selected when phone has country code
                if (phoneValue && (phoneValue.startsWith('+') || phoneValue.startsWith('00')) && !countryValue) {
                    e.preventDefault();
                    alert('Please enter a valid phone number with country code. The country should be automatically detected.');
                    phoneInput.focus();
                    return false;
                }
            });
        }

        // Resume download CTA functionality
        function setupResumeDownloadCTA() {
            const resumeButtons = document.querySelectorAll('[data-resume-download]');
            resumeButtons.forEach(button => {
                // Skip buttons that don't contain "resume" in their text
                const buttonText = button.textContent.toLowerCase();
                if (!buttonText.includes('resume')) {
                    return;
                }
                
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Scroll to contact form
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                        
                        // Auto-select "Resume Download" in purpose dropdown
                        setTimeout(() => {
                            const purposeSelect = document.getElementById('purpose');
                            if (purposeSelect) {
                                purposeSelect.value = 'Resume Download';
                                
                                // Focus on name field for better UX
                                const nameInput = document.querySelector('input[name="name"]');
                                if (nameInput) {
                                    nameInput.focus();
                                }
                            }
                        }, 500); // Small delay to ensure smooth scroll completes
                    }
                });
            });
        }

        // Initialize resume download CTA functionality
        setupResumeDownloadCTA();
    }
});