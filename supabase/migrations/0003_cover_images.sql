-- Folio: every book gets its painted cover plate (public/covers/<id>.webp).
update public.books set cover_image = '/covers/' || id || '.webp';
