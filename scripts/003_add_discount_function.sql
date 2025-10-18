-- Function to increment discount code usage
CREATE OR REPLACE FUNCTION increment_discount_usage(discount_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.discount_codes
  SET current_uses = current_uses + 1
  WHERE id = discount_id;
END;
$$;
