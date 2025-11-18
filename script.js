

// document.documentElement.classList.add("js-enabled");

// // Accumulate every submission attempt
// const form_errors = [];

// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("contactForm");
//   const nameInput = document.getElementById("name");
//   const emailInput = document.getElementById("email");
//   const commentsInput = document.getElementById("comments");
//   const commentsCount = document.getElementById("comments-count");
//   const formErrorsInput = document.getElementById("form-errors");

//   // Create a visible area to show form_errors when submission fails (if not present)
//   let display = document.getElementById("form-errors-display");
//   if (!display) {
//     display = document.createElement("pre");
//     display.id = "form-errors-display";
//     display.style.whiteSpace = "pre-wrap";
//     display.style.background = "#f9be76ff";
//     display.style.border = "1px dashed #f59e0b";
//     display.style.padding = "8px";
//     display.style.margin = "12px 0";
//     display.style.display = "none"; // hidden by default
//     form.parentNode.insertBefore(display, form.nextSibling);
//   }

//   // Allowed-character regex for masking (used only for immediate masking)
//   const allowedPatterns = {
//     name: /^[A-Za-z\s]*$/,
//     email: /^[A-Za-z0-9._%+\-@]*$/,
//     comments: null
//   };

//   const maxLengths = { comments: 150 };
//   const warningThreshold = 0.8;

//   // Initialize counter
//   updateCharacterCount(commentsInput, maxLengths.comments);

//   // -------------------
//   // LIVE (typing) handlers - do NOT log to form_errors
//   // -------------------
//   nameInput.addEventListener("input", (e) => {
//     enforceMasking(e, allowedPatterns.name, "name");
//     liveValidate(nameInput, "name");
//   });

//   emailInput.addEventListener("input", (e) => {
//     enforceMasking(e, allowedPatterns.email, "email");
//     liveValidate(emailInput, "email");
//   });

//   commentsInput.addEventListener("input", (e) => {
//     updateCharacterCount(commentsInput, maxLengths.comments);
//     liveValidate(commentsInput, "comments");
//   });

//   // blur triggers live validation too
//   [nameInput, emailInput, commentsInput].forEach(input => {
//     input.addEventListener("blur", () => {
//       liveValidate(input, input.id);
//     });
//   });

//   // -------------------
//   // SUBMISSION handler - logs to form_errors
//   // -------------------
//   form.addEventListener("submit", (evt) => {
//     evt.preventDefault();

//     // Build error map for this attempt
//     const currentAttemptErrors = {};
//     let hasErrors = false;

//     // Validate each field for submission (uses Constraint Validation API)
//     if (!validateOnSubmit(nameInput, "name", currentAttemptErrors)) hasErrors = true;
//     if (!validateOnSubmit(emailInput, "email", currentAttemptErrors)) hasErrors = true;
//     if (!validateOnSubmit(commentsInput, "comments", currentAttemptErrors)) hasErrors = true;

//     // Always create an attempt record and append to form_errors
//     const attemptRecord = {
//       attempt: form_errors.length + 1,
//       timestamp: new Date().toISOString(),
//       successful: !hasErrors,
//       errors: { ...currentAttemptErrors },
//       formData: {
//         name: nameInput.value,
//         email: emailInput.value,
//         comments: commentsInput.value
//       }
//     };

//     form_errors.push(attemptRecord);
//     // Update hidden input with JSON
//     formErrorsInput.value = JSON.stringify(form_errors);

//     // If there are errors -> show the full form_errors (visible), do not submit
//     if (hasErrors) {
//       // Show the human-friendly current attempt message(s) in the relevant error outputs already added by showError
//       // Also show the whole accumulated form_errors JSON in the visible display area
//       display.textContent = JSON.stringify(form_errors, null, 2);
//       display.style.display = "block";

//       // Optionally focus first invalid field
//       const firstInvalid = form.querySelector(":invalid");
//       if (firstInvalid) firstInvalid.focus();

//       alert("Form contains errors. See inline messages and the form-errors display below.");
//       return;
//     }

//     // No errors -> confirm then submit
//     display.style.display = "none";
//     if (confirm("Submit this form?")) {
//       form.submit();
//     }
//   });

//   // -------------------
//   // FUNCTIONS
//   // -------------------

//   // Live validation during typing or blur. Uses setCustomValidity for messages but DOES NOT log.
//   function liveValidate(input, type) {
//     // clear any previous custom validity (so native state is correct)
//     input.setCustomValidity("");
//     const errEl = document.getElementById(input.id + "-error");
//     if (errEl) {
//       errEl.textContent = "";
//       errEl.classList.add("hidden");
//     }

//     // required
//     if (input.validity.valueMissing) {
//       const msg = `${getFieldLabel(type)} is required.`;
//       input.setCustomValidity(msg);
//       showError(input, msg);
//       return false;
//     }

//     // HTML pattern or type mismatch - show but don't log
//     if (input.validity.patternMismatch || input.validity.typeMismatch) {
//       const msg = getPatternErrorMessage(type);
//       input.setCustomValidity(msg);
//       showError(input, msg);
//       return false;
//     }

//     // Uppercase requirements (live). Only show, don't log here.
//     if (type === "name" && input.value && !/[A-Z]/.test(input.value)) {
//       const msg = "Name must contain at least ONE uppercase letter.";
//       input.setCustomValidity(msg);
//       showError(input, msg);
//       return false;
//     }

//     if (type === "comments" && input.value && !/[A-Z]/.test(input.value)) {
//       const msg = "Comments must contain at least ONE uppercase letter.";
//       input.setCustomValidity(msg);
//       showError(input, msg);
//       return false;
//     }

//     // length check for comments
//     if (type === "comments" && input.value.length > maxLengths.comments) {
//       const msg = `Comments cannot exceed ${maxLengths.comments} characters.`;
//       input.setCustomValidity(msg);
//       showError(input, msg);
//       return false;
//     }

//     // If passes live checks, clear custom validity
//     input.setCustomValidity("");
//     return true;
//   }

//   // Validate for submission — set customValidity, record messages into errorStore if invalid
//   function validateOnSubmit(input, type, errorStore) {
//     // First clear previous custom validity so validity is recomputed
//     input.setCustomValidity("");
//     let msg = null;
//     const val = input.value.trim();

//     // Required
//     if (input.validity.valueMissing) {
//       msg = `${getFieldLabel(type)} is required.`;
//     }
//     // Pattern / email type
//     else if (input.validity.patternMismatch || input.validity.typeMismatch) {
//       msg = getPatternErrorMessage(type);
//     }
//     // Uppercase constraints
//     else if ((type === "name" || type === "comments") && val && !/[A-Z]/.test(val)) {
//       msg = `${getFieldLabel(type)} must contain at least one uppercase letter.`;
//     }
//     // Comments length
//     else if (type === "comments" && val.length > maxLengths.comments) {
//       msg = `Comments cannot exceed ${maxLengths.comments} characters.`;
//     }

//     if (msg) {
//       // set custom validity so browser knows it's invalid
//       input.setCustomValidity(msg);
//       // show visual error (flash + message) and record in current attempt
//       showError(input, msg);
//       errorStore[type] = msg;
//       return false;
//     }

//     // Confirm validity programmatically
//     if (!input.checkValidity()) {
//       // If browser still flags invalid for some reason, collect message and show
//       const fallback = input.validationMessage || getPatternErrorMessage(type);
//       input.setCustomValidity(fallback);
//       showError(input, fallback);
//       errorStore[type] = fallback;
//       return false;
//     }

//     // Everything OK
//     input.setCustomValidity("");
//     return true;
//   }

//   // Masking for illegal characters while typing. These masking events are NOT logged.
//   function enforceMasking(event, allowedPattern, type) {
//     const input = event.target;
//     if (!allowedPattern) return;

//     if (!allowedPattern.test(input.value)) {
//       // Show ephemeral masking error (will auto-hide in showError)
//       showError(input, `Invalid character entered in ${type}.`);

//       // Remove illegal characters (keep allowed subset)
//       // Allow letters, digits, spaces and basic punctuation used in email/name
//       if (type === "name") {
//         input.value = input.value.replace(/[^A-Za-z\s]/g, "");
//       } else if (type === "email") {
//         input.value = input.value.replace(/[^A-Za-z0-9._%+\-@]/g, "");
//       } else {
//         // generic sanitize
//         input.value = input.value.replace(/[^\S\n]/g, "");
//       }

//       // brief flash class for immediate feedback (class removed in showError timeout)
//       input.classList.add("flash");
//       setTimeout(() => input.classList.remove("flash"), 500);
//     }
//   }

//   function updateCharacterCount(textarea, maxLength) {
//     const len = textarea.value.length;
//     const remaining = maxLength - len;

//     commentsCount.textContent = `${remaining} characters remaining`;
//     commentsCount.className = "char-count";

//     // warning state
//     if (remaining < 0) {
//       commentsCount.classList.add("error");
//       commentsCount.textContent = `Character limit exceeded by ${Math.abs(remaining)}`;
//       // show field-level error as well (but don't log here)
//       showError(textarea, `Character limit exceeded by ${Math.abs(remaining)}`);
//     } else if (len >= maxLength * warningThreshold) {
//       commentsCount.classList.add("warning");
//     }
//   }

//   // showError keeps your flashing + 3s auto-hide behavior and writes into <output id="-error">
//   function showError(input, message) {
//     const out = document.getElementById(input.id + "-error");
//     if (out) {
//       out.textContent = message;
//       out.classList.remove("hidden");
//     }

//     // Add flash class to input to trigger border animation (your CSS uses .flash)
//     input.classList.add("flash");

//     // Ensure we clear previous hide-timeout if user triggers another error quickly
//     if (input._hideTimeout) clearTimeout(input._hideTimeout);

//     // Auto-hide after 3s (remove flash and hide message)
//     input._hideTimeout = setTimeout(() => {
//       if (out) out.classList.add("hidden");
//       input.classList.remove("flash");
//       input._hideTimeout = null;
//     }, 3000);
//   }

//   function getFieldLabel(t) {
//     return {
//       name: "Full name",
//       email: "Email address",
//       comments: "Comments"
//     }[t] || t;
//   }

//   function getPatternErrorMessage(t) {
//     return {
//       name: "Only letters and spaces allowed.",
//       email: "Please enter a valid email (e.g., user@example.com).",
//       comments: "Comments must be under 150 characters and include valid content."
//     }[t] || "Invalid format.";
//   }
// });











// FORM ERROR PRETTY WORKS 
// document.documentElement.classList.add("js-enabled");

// // Stores ALL submission attempts
// const form_errors = [];

// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.getElementById("contactForm");
//     const nameInput = document.getElementById("name");
//     const emailInput = document.getElementById("email");
//     const commentsInput = document.getElementById("comments");
//     const commentsCount = document.getElementById("comments-count");
//     const formErrorsInput = document.getElementById("form-errors");

//     const maxLengths = { comments: 150 };
//     const warningThreshold = 0.8;

//     updateCharacterCount(commentsInput, maxLengths.comments);

//     // -----------------------------
//     //  LIVE VALIDATION (NO LOGGING)
//     // -----------------------------
//     nameInput.addEventListener("input", function (event) {
//         enforceCharacterMasking(event, /^[A-Za-z\s]+$/, 'name');
//         liveValidate(nameInput, "name");
//     });

//     emailInput.addEventListener("input", function (event) {
//         enforceCharacterMasking(event, /^[a-zA-Z0-9._%+\-@]*$/, 'email');
//         liveValidate(emailInput, "email");
//     });

//     commentsInput.addEventListener("input", function (event) {
//         updateCharacterCount(event.target, maxLengths.comments);
//         liveValidate(commentsInput, "comments");
//     });

//     // -----------------------------
//     //  SUBMISSION VALIDATION (LOGGING)
//     // -----------------------------
//     form.addEventListener("submit", function (event) {
//         event.preventDefault();

//         const currentAttemptErrors = {};
//         let hasErrors = false;

//         if (!submissionValidate(nameInput, "name", currentAttemptErrors)) hasErrors = true;
//         if (!submissionValidate(emailInput, "email", currentAttemptErrors)) hasErrors = true;
//         if (!submissionValidate(commentsInput, "comments", currentAttemptErrors)) hasErrors = true;

//         // Always create an attempt entry
//         const attemptRecord = {
//             attempt: form_errors.length + 1,
//             timestamp: new Date().toISOString(),
//             successful: !hasErrors,
//             errors: currentAttemptErrors,
//             formData: {
//                 name: nameInput.value,
//                 email: emailInput.value,
//                 comments: commentsInput.value
//             }
//         };

//         form_errors.push(attemptRecord);
//         formErrorsInput.value = JSON.stringify(form_errors);

//         if (hasErrors) {
//             alert("There were errors. Check fields and try again.");
//             return;
//         }

//         if (confirm("Submit this form?")) {
//             form.submit();
//         }
//     });

//     // -----------------------------
//     // FUNCTIONS
//     // -----------------------------

//     function liveValidate(input, type) {
//         const errorOutput = document.getElementById(input.id + "-error");
//         errorOutput.classList.add("hidden");
//         errorOutput.textContent = "";

//         if (input.validity.valueMissing) {
//             showError(input, `${getFieldLabel(type)} is required.`);
//         }

//         // Custom uppercase requirement
//         if (type === "name" && !/[A-Z]/.test(input.value)) {
//             showError(input, "Name must contain at least ONE uppercase letter.");
//         }

//         if (type === "comments" && input.value && !/[A-Z]/.test(input.value)) {
//             showError(input, "Comments must contain at least ONE uppercase letter.");
//         }
//     }

//     function submissionValidate(input, type, errorStore) {
//         const value = input.value.trim();
//         let message = null;

//         if (input.validity.valueMissing) {
//             message = `${getFieldLabel(type)} is required.`;
//         }

//         else if (type === "name" && !/[A-Z]/.test(value)) {
//             message = "Name must contain at least one uppercase letter.";
//         }

//         else if (type === "comments" && value && !/[A-Z]/.test(value)) {
//             message = "Comments must contain at least one uppercase letter.";
//         }

//         else if (input.validity.patternMismatch) {
//             message = getPatternErrorMessage(type);
//         }

//         else if (type === "comments" && value.length > maxLengths.comments) {
//             message = `Comments cannot exceed ${maxLengths.comments} characters.`;
//         }

//         if (message) {
//             errorStore[type] = message;
//             showError(input, message);
//             return false;
//         }
//         return true;
//     }

//     // MASKING (NO LOGGING)
//     function enforceCharacterMasking(event, pattern, type) {
//         const input = event.target;

//         if (!pattern.test(input.value)) {
//             showError(input, `Invalid character entered in ${type}.`);
//             input.classList.add("flash");

//             input.value = input.value.replace(/[^A-Za-z0-9._%+\-@ ]/g, "");
//             setTimeout(() => input.classList.remove("flash"), 500);
//         }
//     }

//     function updateCharacterCount(textarea, maxLength) {
//         const length = textarea.value.length;
//         const remaining = maxLength - length;

//         commentsCount.textContent = `${remaining} characters remaining`;
//         commentsCount.className = "char-count";

//         if (remaining < 0) {
//             commentsCount.classList.add("error");
//             commentsCount.textContent = `Limit exceeded by ${Math.abs(remaining)}`;
//         }
//         else if (length >= maxLength * warningThreshold) {
//             commentsCount.classList.add("warning");
//         }
//     }

//     function showError(input, message) {
//         const errorOutput = document.getElementById(input.id + "-error");
//         errorOutput.textContent = message;
//         errorOutput.classList.remove("hidden");
//         input.classList.add("flash");

//         setTimeout(() => {
//             input.classList.remove("flash");
//         }, 3000);
//     }

//     function getFieldLabel(t) {
//         return { name: "Full name", email: "Email", comments: "Comments" }[t];
//     }

//     function getPatternErrorMessage(t) {
//         return {
//             name: "Only letters and spaces allowed.",
//             email: "Invalid email format.",
//             comments: "Comments format invalid."
//         }[t];
//     }
// });



//--------------Styling pretty good


// Add a class to <html> to indicate JS is enabled

document.documentElement.classList.add("js-enabled");

// Form errors array to track all validation errors
const form_errors = [];

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const commentsInput = document.getElementById("comments");
    const commentsCount = document.getElementById("comments-count");
    const formErrorsInput = document.getElementById("form-errors");

    // Character limits and patterns
    const patterns = {
        name: /^[A-Za-z\s]*$/, // Only letters and spaces
        email: /^[a-z0-9._%+-@]*$/i, // Basic email characters
        comments: null // No character restrictions beyond length
    };

    // Maximum lengths
    const maxLengths = {
        comments: 150
    };

    // Warning thresholds (percentage)
    const warningThreshold = 0.8; // 80% of max length

    // Initialize character counter
    updateCharacterCount(commentsInput, maxLengths.comments);
//         // Temporary object for current submission attempt errors
//         const currentAttemptErrors = {};
//         let hasErrors = false;
        
//         // Validate each field individually
//         if (!validateField(nameInput, currentAttemptErrors)) hasErrors = true;
//         if (!validateField(emailInput, currentAttemptErrors)) hasErrors = true;
//         if (!validateField(commentsInput, currentAttemptErrors)) hasErrors = true;
        
//         console.log("Current attempt errors:", currentAttemptErrors);
//         console.log("Has errors:", hasErrors);
        
//         // Create attempt record - ALWAYS create one for every submission
//         const attemptRecord = {
//             attempt: form_errors.length + 1,
//             errors: { ...currentAttemptErrors },
//             timestamp: new Date().toISOString(),
//             successful: !hasErrors,
//             formData: {
//                 name: nameInput.value,
//                 email: emailInput.value,
//                 comments: commentsInput.value
//             }
//         };
        
//         // ALWAYS add to form_errors for every submission attempt
//         form_errors.push(attemptRecord);
//         console.log("Added to form_errors:", attemptRecord);
        
//         // Update hidden field with ALL accumulated errors
//         formErrorsInput.value = JSON.stringify(form_errors);
//         console.log("All accumulated errors:", form_errors);
        
//         if (!hasErrors) {
//             const confirmSend = confirm("Send the message. Continue?");
//             if (confirmSend) {
//                 console.log("Final submission with all errors:", formErrorsInput.value);
//                 // Submit the form
//                 form.submit();
//             } else {
//                 // User canceled - remove the last attempt since they didn't actually submit
//                 form_errors.pop();
//                 formErrorsInput.value = JSON.stringify(form_errors);
//             }
//         } else {
//             alert("Please fix the errors and try again. All attempts are being recorded.");
//         }
//     });

    // Form submission handler
    form.addEventListener("submit", function (event) {
        // Clear previous errors
        form_errors.length = 0;
        
        // Validate all fields1
        const isNameValid = validateField(nameInput, 'name');
        const isEmailValid = validateField(emailInput, 'email');
        const isCommentsValid = validateField(commentsInput, 'comments');

        if (!isNameValid || !isEmailValid || !isCommentsValid) {
            event.preventDefault();
            
            // Store errors in hidden field as JSON
            formErrorsInput.value = JSON.stringify(form_errors);
            
            // For demo purposes, show what would be submitted
            console.log('Form errors to be submitted:', form_errors);
            alert('Please fix the form errors before submitting. Check console for error details.');
        } else {
            // All valid - encode errors array (empty) and submit
            formErrorsInput.value = JSON.stringify(form_errors);
        }
    });

    // Real-time validation and masking
    nameInput.addEventListener("input", function(event) {
        enforceCharacterMasking(event, 'name');
        validateField(event.target, 'name');
    });

    emailInput.addEventListener("input", function(event) {
        enforceCharacterMasking(event, 'email');
        validateField(event.target, 'email');
    });

    commentsInput.addEventListener("input", function(event) {
        updateCharacterCount(event.target, maxLengths.comments);
        validateField(event.target, 'comments');
    });

    // Field blur validation (when user leaves field)
    [nameInput, emailInput, commentsInput].forEach(input => {
        input.addEventListener("blur", function() {
            const fieldType = input.id;
            validateField(input, fieldType);
        });
    });

    // Functions
    function validateField(input, fieldType) {
        const errorOutput = document.getElementById(input.id + "-error");
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        errorOutput.textContent = '';
        errorOutput.classList.add('hidden');

        // Required field validation
        if (input.validity.valueMissing) {
            errorMessage = `${getFieldLabel(fieldType)} is required.`;
            isValid = false;
        }
        // Pattern validation
        else if (input.validity.patternMismatch) {
            errorMessage = getPatternErrorMessage(fieldType);
            isValid = false;
        }
        // Custom validation for comments length
        else if (fieldType === 'comments' && input.value.length > maxLengths.comments) {
            errorMessage = `Comments cannot exceed ${maxLengths.comments} characters.`;
            isValid = false;
        }
        // Email format validation
        else if (fieldType === 'email' && input.validity.typeMismatch) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }

        // Show error if invalid
        if (!isValid) {
            showError(input, errorMessage);
            
            // Log error to form_errors array
            form_errors.push({
                field: fieldType,
                message: errorMessage,
                value: input.value,
                timestamp: new Date().toISOString()
            });
        }

        return isValid;
    }

    function enforceCharacterMasking(event, fieldType) {
        const input = event.target;
        const pattern = patterns[fieldType];
        
        if (pattern && !pattern.test(input.value)) {
            showError(input, `Invalid character entered. Only allowed characters are permitted.`);
            
            // Remove invalid characters
            input.value = input.value.replace(/[^A-Za-z\s]/g, '');
            
            // Log masking event
            form_errors.push({
                field: fieldType,
                type: 'masking',
                message: 'Invalid character was filtered out',
                value: event.data,
                timestamp: new Date().toISOString()
            });
        }
    }

    function updateCharacterCount(textarea, maxLength) {
        const currentLength = textarea.value.length;
        const remaining = maxLength - currentLength;
        
        commentsCount.textContent = `${remaining} characters remaining`;
        commentsCount.className = 'char-count';
        
        if (remaining <= 0) {
            commentsCount.classList.add('error');
            commentsCount.textContent = `Character limit exceeded by ${Math.abs(remaining)}`;
        } else if (currentLength >= maxLength * warningThreshold) {
            commentsCount.classList.add('warning');
        }
    }

    function showError(input, message) {
        const errorOutput = document.getElementById(input.id + "-error");
        errorOutput.textContent = message;
        errorOutput.classList.remove("hidden");
        input.classList.add("flash");

        // Auto-hide after 3 seconds (for masking errors)
        setTimeout(() => {
            errorOutput.classList.add("hidden");
            input.classList.remove("flash");
        }, 3000);
    }

    function getFieldLabel(fieldType) {
        const labels = {
            name: 'Full name',
            email: 'Email address',
            comments: 'Comments'
        };
        return labels[fieldType] || fieldType;
    }

    function getPatternErrorMessage(fieldType) {
        const messages = {
            name: 'Only letters and spaces are allowed (2-50 characters).',
            email: 'Please enter a valid email address (e.g., user@example.com).',
            comments: 'Comments must be under 150 characters.'
        };
        return messages[fieldType] || 'Invalid format.';
    }
});

//---------------------------------


// // Add a class to <html> to indicate JS is enabled
// document.documentElement.classList.add("js-enabled");

// // Contact Form
// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.getElementById("contactForm");
//     const nameInput = document.getElementById("name");
//     const emailInput = document.getElementById("email");
//     const commentsInput = document.getElementById("comments");
//     const formErrorsInput = document.getElementById("form-errors");
//     const commentsCount = document.getElementById("comments-count");

//     // Array to store ALL form errors from ALL submission attempts
//     const form_errors = [];

//     // Submit handler
//     form.addEventListener("submit", function (event) {
//         event.preventDefault();
        
//         console.log("Form submission attempted");
        
//         // Temporary object for current submission attempt errors
//         const currentAttemptErrors = {};
//         let hasErrors = false;
        
//         // Validate each field individually
//         if (!validateField(nameInput, currentAttemptErrors)) hasErrors = true;
//         if (!validateField(emailInput, currentAttemptErrors)) hasErrors = true;
//         if (!validateField(commentsInput, currentAttemptErrors)) hasErrors = true;
        
//         console.log("Current attempt errors:", currentAttemptErrors);
//         console.log("Has errors:", hasErrors);
        
//         // Create attempt record - ALWAYS create one for every submission
//         const attemptRecord = {
//             attempt: form_errors.length + 1,
//             errors: { ...currentAttemptErrors },
//             timestamp: new Date().toISOString(),
//             successful: !hasErrors,
//             formData: {
//                 name: nameInput.value,
//                 email: emailInput.value,
//                 comments: commentsInput.value
//             }
//         };
        
//         // ALWAYS add to form_errors for every submission attempt
//         form_errors.push(attemptRecord);
//         console.log("Added to form_errors:", attemptRecord);
        
//         // Update hidden field with ALL accumulated errors
//         formErrorsInput.value = JSON.stringify(form_errors);
//         console.log("All accumulated errors:", form_errors);
        
//         if (!hasErrors) {
//             const confirmSend = confirm("Send the message. Continue?");
//             if (confirmSend) {
//                 console.log("Final submission with all errors:", formErrorsInput.value);
//                 // Submit the form
//                 form.submit();
//             } else {
//                 // User canceled - remove the last attempt since they didn't actually submit
//                 form_errors.pop();
//                 formErrorsInput.value = JSON.stringify(form_errors);
//             }
//         } else {
//             alert("Please fix the errors and try again. All attempts are being recorded.");
//         }
//     });

//     // Show error message
//     function showError(input, message, isTemporary = false) {
//         const errorOutput = document.getElementById(input.id + "-error");
//         errorOutput.textContent = message;
//         errorOutput.classList.remove("hidden");
//         input.classList.add("flash");

//         if (isTemporary) {
//             setTimeout(() => {
//                 errorOutput.classList.add("hidden");
//                 input.classList.remove("flash");
//             }, 2000);
//         }
//     }

//     // Clear error message
//     function clearError(input) {
//         const errorOutput = document.getElementById(input.id + "-error");
//         errorOutput.classList.add("hidden");
//         input.classList.remove("flash");
//     }

//     // Validate individual field with customized error messages
//     function validateField(input, currentAttemptErrors) {
//         const fieldName = input.name || input.id;
//         const value = input.value.trim();
        
//         clearError(input);
//         console.log(`Validating ${fieldName}:`, value);

//         let isValid = true;
//         let errorMessage = '';

//         // Check required fields
//         if (input.hasAttribute('required') && value === '') {
//             errorMessage = getRequiredErrorMessage(fieldName);
//             isValid = false;
//         }
//         // NAME FIELD VALIDATION
//         else if (fieldName === 'name' && value !== '') {
//             // Check minimum length
//             if (value.length < 2) {
//                 errorMessage = "Name must be at least 2 characters long";
//                 isValid = false;
//             }
//             // Check maximum length
//             else if (value.length > 50) {
//                 errorMessage = "Name cannot exceed 50 characters";
//                 isValid = false;
//             }
//             // Check starts with uppercase
//             else if (!/^[A-Z]/.test(value)) {
//                 errorMessage = "Name must start with an uppercase letter";
//                 isValid = false;
//             }
//             // Check only letters and spaces pattern
//             else if (!/^[A-Za-z\s]+$/.test(value)) {
//                 errorMessage = "Name can only contain letters and spaces";
//                 isValid = false;
//             }
//         }
//         // EMAIL FIELD VALIDATION
//         else if (fieldName === 'email' && value !== '') {
//             // Check minimum length
//             if (value.length < 2) {
//                 errorMessage = "Email must be at least 2 characters long";
//                 isValid = false;
//             }
//             // Check maximum length
//             else if (value.length > 100) {
//                 errorMessage = "Email cannot exceed 100 characters";
//                 isValid = false;
//             }
//             // Check email format
//             else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
//                 errorMessage = "Please enter a valid email address (e.g., user@example.com)";
//                 isValid = false;
//             }
//         }
//         // COMMENTS FIELD VALIDATION (only if value exists since it's optional)
//         else if (fieldName === 'comments' && value !== '') {
//             // Check maximum length
//             if (value.length > 150) {
//                 errorMessage = "Comments cannot exceed 150 characters";
//                 isValid = false;
//             }
//             // Check for at least one uppercase letter
//             else if (!/[A-Z]/.test(value)) {
//                 errorMessage = "Comments must include at least one uppercase letter";
//                 isValid = false;
//             }
//             // Check for at least one lowercase letter
//             else if (!/[a-z]/.test(value)) {
//                 errorMessage = "Comments must include at least one lowercase letter";
//                 isValid = false;
//             }
//         }

//         // If invalid, show error and record it
//         if (!isValid) {
//             showError(input, errorMessage, false);
//             currentAttemptErrors[fieldName] = errorMessage;
//             console.log(`Field ${fieldName} invalid:`, errorMessage);
//         } else {
//             console.log(`Field ${fieldName} is valid`);
//         }

//         return isValid;
//     }

//     // Get customized required error messages
//     function getRequiredErrorMessage(fieldName) {
//         const messages = {
//             'name': 'Full name is required',
//             'email': 'Email address is required', 
//             'comments': 'Comments are required'
//         };
//         return messages[fieldName] || 'This field is required';
//     }

//     // Character masking for name field (enhanced for uppercase requirement)
//     function enforceCharacterRules(event) {
//         const input = event.target;
//         const fieldName = input.id;
        
//         if (fieldName === 'name') {
//             const allowedChars = /^[A-Za-z\s]*$/;
//             if (!allowedChars.test(input.value)) {
//                 showError(input, "Invalid character entered. Only letters and spaces allowed.", true);
//                 input.value = input.value.replace(/[^A-Za-z\s]/g, "");
//             }
            
//             // Auto-capitalize first letter
//             if (input.value.length === 1 && /[a-z]/.test(input.value)) {
//                 input.value = input.value.toUpperCase();
//             }
//         } else if (fieldName === 'email') {
//             const allowedChars = /^[a-zA-Z0-9._%+-@]*$/;
//             if (!allowedChars.test(input.value)) {
//                 showError(input, "Invalid character entered. Only letters, numbers, and @ . _ % + - allowed.", true);
//                 input.value = input.value.replace(/[^a-zA-Z0-9._%+-@]/g, "");
//             }
//         }
//     }

//     // Update character count for comments
//     function updateCharacterCount() {
//         const currentLength = commentsInput.value.length;
//         const maxLength = 150;
//         const remaining = maxLength - currentLength;
        
//         commentsCount.textContent = `${remaining} characters remaining`;
//         commentsCount.classList.remove('warning', 'error');
        
//         if (currentLength >= maxLength) {
//             commentsCount.classList.add('error');
//             commentsCount.textContent = `Character limit exceeded! (${currentLength}/${maxLength})`;
//         } else if (currentLength >= 135) {
//             commentsCount.classList.add('warning');
//         }
        
//         // Real-time validation feedback for comments
//         if (currentLength > 0) {
//             const hasUpperCase = /[A-Z]/.test(commentsInput.value);
//             const hasLowerCase = /[a-z]/.test(commentsInput.value);
            
//             if (!hasUpperCase || !hasLowerCase) {
//                 commentsCount.textContent += ` - Needs both uppercase & lowercase letters`;
//                 commentsCount.classList.add('warning');
//             }
//         }
//     }

//     // Event listeners
//     nameInput.addEventListener("input", enforceCharacterRules);
//     emailInput.addEventListener("input", enforceCharacterRules);
//     commentsInput.addEventListener("input", updateCharacterCount);

//     // Clear errors when user types
//     form.addEventListener("input", function(event) {
//         clearError(event.target);
//     });

//     // Initialize character count
//     updateCharacterCount();

//     // Debug function to check errors in console
//     window.getFormErrors = function() {
//         console.log('Current form_errors:', form_errors);
//         return form_errors;
//     };
// });







//----------------------


// // Add a class to <html> to indicate JS is enabled
// document.documentElement.classList.add("js-enabled");

// // Contact Form
// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.getElementById("contactForm");
//     const nameInput = document.getElementById("name");
//     const emailInput = document.getElementById("email");
//     const commentsInput = document.getElementById("comments");
//     const formErrorsInput = document.getElementById("form-errors");

//     // Array to store ALL form errors from ALL submission attempts
//     const form_errors = [];

//     // Submit handler
//     form.addEventListener("submit", function (event) {
//         event.preventDefault();
        
//         console.log("Form submission attempted");
        
//         // Temporary object for current submission attempt errors
//         const currentAttemptErrors = {};
//         let hasErrors = false;
        
//         // Validate each field individually
//         if (!validateField(nameInput, currentAttemptErrors)) hasErrors = true;
//         if (!validateField(emailInput, currentAttemptErrors)) hasErrors = true;
//         if (!validateField(commentsInput, currentAttemptErrors)) hasErrors = true;
        
//         console.log("Current attempt errors:", currentAttemptErrors);
//         console.log("Has errors:", hasErrors);
        
//         // Create attempt record
//         const attemptRecord = {
//             attempt: form_errors.length + 1,
//             errors: { ...currentAttemptErrors },
//             timestamp: new Date().toISOString(),
//             successful: !hasErrors
//         };
        
//         // Always add to form_errors if there were errors in this attempt
//         if (Object.keys(currentAttemptErrors).length > 0) {
//             form_errors.push(attemptRecord);
//             console.log("Added to form_errors:", attemptRecord);
//         }
        
//         // Update hidden field with ALL accumulated errors
//         formErrorsInput.value = JSON.stringify(form_errors);
//         console.log("All accumulated errors:", form_errors);
        
//         if (!hasErrors) {
//             const confirmSend = confirm("Send the message. Continue?");
//             if (confirmSend) {
//                 console.log("Final submission with all errors:", formErrorsInput.value);
//                 form.submit();
//             }
//         } else {
//             alert("Please fix the errors and try again. All attempts are being recorded.");
//         }
//     });

//     // Show error message
//     function showError(input, message, isTemporary = false) {
//         const errorOutput = document.getElementById(input.id + "-error");
//         errorOutput.textContent = message;
//         errorOutput.classList.remove("hidden");
//         input.classList.add("flash");

//         if (isTemporary) {
//             setTimeout(() => {
//                 errorOutput.classList.add("hidden");
//                 input.classList.remove("flash");
//             }, 2000);
//         }
//     }

//     // Clear error message
//     function clearError(input) {
//         const errorOutput = document.getElementById(input.id + "-error");
//         errorOutput.classList.add("hidden");
//         input.classList.remove("flash");
//     }

//     // Validate individual field with customized error messages
//     function validateField(input, currentAttemptErrors) {
//         const fieldName = input.name || input.id;
//         const value = input.value.trim();
        
//         clearError(input);
//         console.log(`Validating ${fieldName}:`, value);

//         let isValid = true;
//         let errorMessage = '';

//         // Check required fields
//         if (input.hasAttribute('required') && value === '') {
//             errorMessage = getRequiredErrorMessage(fieldName);
//             isValid = false;
//         }
//         // NAME FIELD VALIDATION
//         else if (fieldName === 'name' && value !== '') {
//             // Check minimum length
//             if (value.length < 2) {
//                 errorMessage = "Name must be at least 2 characters long";
//                 isValid = false;
//             }
//             // Check maximum length
//             else if (value.length > 50) {
//                 errorMessage = "Name cannot exceed 50 characters";
//                 isValid = false;
//             }
//             // Check starts with uppercase
//             else if (!/^[A-Z]/.test(value)) {
//                 errorMessage = "Name must start with an uppercase letter";
//                 isValid = false;
//             }
//             // Check only letters and spaces pattern
//             else if (!/^[A-Za-z\s]+$/.test(value)) {
//                 errorMessage = "Name can only contain letters and spaces";
//                 isValid = false;
//             }
//         }
//         // EMAIL FIELD VALIDATION
//         else if (fieldName === 'email' && value !== '') {
//             // Check minimum length
//             if (value.length < 2) {
//                 errorMessage = "Email must be at least 2 characters long";
//                 isValid = false;
//             }
//             // Check maximum length
//             else if (value.length > 100) {
//                 errorMessage = "Email cannot exceed 100 characters";
//                 isValid = false;
//             }
//             // Check email format
//             else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
//                 errorMessage = "Please enter a valid email address (e.g., user@example.com)";
//                 isValid = false;
//             }
//         }
//         // COMMENTS FIELD VALIDATION (only if value exists since it's optional)
//         else if (fieldName === 'comments' && value !== '') {
//             // Check maximum length
//             if (value.length > 150) {
//                 errorMessage = "Comments cannot exceed 150 characters";
//                 isValid = false;
//             }
//             // Check for at least one uppercase letter
//             else if (!/[A-Z]/.test(value)) {
//                 errorMessage = "Comments must include at least one uppercase letter";
//                 isValid = false;
//             }
//             // Check for at least one lowercase letter
//             else if (!/[a-z]/.test(value)) {
//                 errorMessage = "Comments must include at least one lowercase letter";
//                 isValid = false;
//             }
//         }

//         // If invalid, show error and record it
//         if (!isValid) {
//             showError(input, errorMessage, false);
//             currentAttemptErrors[fieldName] = errorMessage;
//             console.log(`Field ${fieldName} invalid:`, errorMessage);
//         }

//         return isValid;
//     }

//     // Get customized required error messages
//     function getRequiredErrorMessage(fieldName) {
//         const messages = {
//             'name': 'Full name is required',
//             'email': 'Email address is required', 
//             'comments': 'Comments are required'
//         };
//         return messages[fieldName] || 'This field is required';
//     }

//     // Character masking for name field (enhanced for uppercase requirement)
//     function enforceCharacterRules(event) {
//         const input = event.target;
//         const fieldName = input.id;
        
//         if (fieldName === 'name') {
//             const allowedChars = /^[A-Za-z\s]*$/;
//             if (!allowedChars.test(input.value)) {
//                 showError(input, "Invalid character entered. Only letters and spaces allowed.", true);
//                 input.value = input.value.replace(/[^A-Za-z\s]/g, "");
//             }
            
//             // Auto-capitalize first letter
//             if (input.value.length === 1 && /[a-z]/.test(input.value)) {
//                 input.value = input.value.toUpperCase();
//             }
//         } else if (fieldName === 'email') {
//             const allowedChars = /^[a-zA-Z0-9._%+-@]*$/;
//             if (!allowedChars.test(input.value)) {
//                 showError(input, "Invalid character entered. Only letters, numbers, and @ . _ % + - allowed.", true);
//                 input.value = input.value.replace(/[^a-zA-Z0-9._%+-@]/g, "");
//             }
//         }
//     }

//     // Update character count for comments
//     function updateCharacterCount() {
//         const countElement = document.getElementById('comments-count');
//         const currentLength = commentsInput.value.length;
//         const maxLength = 150;
//         const remaining = maxLength - currentLength;
        
//         countElement.textContent = `${remaining} characters remaining`;
//         countElement.classList.remove('warning', 'error');
        
//         if (currentLength >= maxLength) {
//             countElement.classList.add('error');
//             countElement.textContent = `Character limit exceeded! (${currentLength}/${maxLength})`;
//         } else if (currentLength >= 135) {
//             countElement.classList.add('warning');
//         }
        
//         // Real-time validation feedback for comments
//         if (currentLength > 0) {
//             const hasUpperCase = /[A-Z]/.test(commentsInput.value);
//             const hasLowerCase = /[a-z]/.test(commentsInput.value);
            
//             if (!hasUpperCase || !hasLowerCase) {
//                 countElement.textContent += ` - Needs both uppercase & lowercase letters`;
//                 countElement.classList.add('warning');
//             }
//         }
//     }

//     // Event listeners
//     nameInput.addEventListener("input", enforceCharacterRules);
//     emailInput.addEventListener("input", enforceCharacterRules);
//     commentsInput.addEventListener("input", updateCharacterCount);

//     // Clear errors when user types
//     form.addEventListener("input", function(event) {
//         clearError(event.target);
//     });

//     // Initialize
//     updateCharacterCount();

//     // Debug function
//     window.getFormErrors = function() {
//         return form_errors;
//     };
// });

