'use client';

/** Product/Combo card er button: order form e item add kore scroll kore niye jay */
export default function AddToOrderButton({
  type,
  id,
  label = 'অর্ডার করুন',
  className = 'btn-primary w-full',
}: {
  type: 'p' | 'c';
  id: number;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent('rbh:add', { detail: `${type}:${id}` }));
        const el = document.getElementById('order');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.location.href = `/?add=${type}:${id}#order`;
      }}
    >
      {label}
    </button>
  );
}
