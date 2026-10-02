import React from 'react';
import { User, Phone, Sparkles } from 'lucide-react';

export const CustomerForm = ({ formData, onChange, errors }) => {
  return (
    <div className="section-card">
      <div className="section-header">
        <span className="step-badge">1</span>
        <div>
          <h3 className="section-title">Client Information</h3>
          <p className="section-subtitle">Please provide your contact details for appointment booking</p>
        </div>
      </div>

      <div className="form-grid">
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="customerName" className="form-label">
            Full Name <span className="required-star">*</span>
          </label>
          <div className="input-wrapper">
            <User className="input-icon" size={18} />
            <input
              type="text"
              id="customerName"
              name="customerName"
              className={`form-input ${errors.customerName ? 'input-error' : ''}`}
              placeholder="e.g. Alex Morgan"
              value={formData.customerName}
              onChange={onChange}
            />
          </div>
          {errors.customerName && <p className="error-text">{errors.customerName}</p>}
        </div>

        {/* Age */}
        <div className="form-group">
          <label htmlFor="customerAge" className="form-label">
            Age <span className="required-star">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="number"
              id="customerAge"
              name="customerAge"
              className={`form-input ${errors.customerAge ? 'input-error' : ''}`}
              placeholder="e.g. 24"
              value={formData.customerAge}
              onChange={onChange}
              min="1"
            />
          </div>
          {errors.customerAge && <p className="error-text">{errors.customerAge}</p>}
        </div>

        {/* Gender */}
        <div className="form-group">
          <label htmlFor="customerGender" className="form-label">
            Gender <span className="required-star">*</span>
          </label>
          <div className="input-wrapper">
            <select
              id="customerGender"
              name="customerGender"
              className={`form-input select-input ${errors.customerGender ? 'input-error' : ''}`}
              value={formData.customerGender}
              onChange={onChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          {errors.customerGender && <p className="error-text">{errors.customerGender}</p>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="customerPhone" className="form-label">
            Phone Number <span className="required-star">*</span>
          </label>
          <div className="input-wrapper">
            <Phone className="input-icon" size={18} />
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              className={`form-input ${errors.customerPhone ? 'input-error' : ''}`}
              placeholder="e.g. +1 (555) 234-5678"
              value={formData.customerPhone}
              onChange={onChange}
            />
          </div>
          {errors.customerPhone && <p className="error-text">{errors.customerPhone}</p>}
        </div>
      </div>
    </div>
  );
};
