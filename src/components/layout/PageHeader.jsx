import React from 'react';
import PropTypes from 'prop-types';

const PageHeader = ({ title, description, icon, overline, actions }) => {
    return (
        <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
                {(overline || icon) && (
                    <div className="flex items-center gap-2 mb-3 text-green-600 font-bold text-sm uppercase tracking-[0.15em]">
                        {icon && <i className={`${icon} text-base`}></i>}
                        {overline && <span>{overline}</span>}
                    </div>
                )}
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
                    {title}
                </h1>
                {description && (
                    <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {actions}
                </div>
            )}
        </header>
    );
};

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.string,
    overline: PropTypes.string,
    actions: PropTypes.node
};

export default PageHeader;
