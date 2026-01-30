import { useEffect, useState } from "react";
import api from "../../services/api";

const ShopDetails = () => {
  const [form, setForm] = useState({
    shop_name: "",
    owner_name: "",
    phone: "",
    address: "",
    gst_number: "",
    dl_number: "",
  });

  const [fetchedData, setFetchedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const res = await api.get("/shop-profile/");
        if (res.data) {
          const shopData = {
            shop_name: res.data.shop_name || "",
            owner_name: res.data.owner_name || "",
            phone: res.data.phone || "",
            address: res.data.address || "",
            gst_number: res.data.gst_number || "",
            dl_number: res.data.dl_number || "",
          };
          setFetchedData(res.data);
          setForm(shopData);
        }
      } catch (err) {
        console.log("No existing shop profile (GET returned error), starting fresh");
        setFetchedData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // Merge fetched data with current form state to preserve all fields
      const payload = {
        shop_name: form.shop_name || fetchedData?.shop_name || "",
        owner_name: form.owner_name || fetchedData?.owner_name || "",
        phone: form.phone || fetchedData?.phone || "",
        address: form.address || fetchedData?.address || "",
        gst_number: form.gst_number || fetchedData?.gst_number || "",
        dl_number: form.dl_number || fetchedData?.dl_number || "",
      };

      // POST the complete payload (backend treats this as create-or-replace)
      const response = await api.post(
        "/shop-profile/",
        payload
      );

      // Update local state with the response from backend
      if (response.data) {
        const updatedData = {
          shop_name: response.data.shop_name || "",
          owner_name: response.data.owner_name || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          gst_number: response.data.gst_number || "",
          dl_number: response.data.dl_number || "",
        };
        setFetchedData(response.data);
        setForm(updatedData);
      }

      // Show success message
      setMessage({
        type: "success",
        text: "Shop details saved successfully!",
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Failed to save shop details";

      setMessage({
        type: "error",
        text: `Error: ${errorMsg}`,
      });

      console.error("Shop profile save error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading shop details...</p>;

  return (
    <div className="card space-y-4">
      <h3 className="text-xl font-semibold">Shop / Owner Details</h3>

      {message.text && (
        <div
          className={`p-3 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          className="input"
          name="shop_name"
          placeholder="Shop Name"
          value={form.shop_name}
          onChange={handleChange}
        />

        <input
          className="input"
          name="owner_name"
          placeholder="Owner Name"
          value={form.owner_name}
          onChange={handleChange}
        />

        <input
          className="input"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />

        <textarea
          className="input"
          name="address"
          placeholder="Shop Address"
          value={form.address}
          onChange={handleChange}
        />

        <input
          className="input"
          name="gst_number"
          placeholder="GST Number (optional)"
          value={form.gst_number}
          onChange={handleChange}
        />

        <input
          className="input"
          name="dl_number"
          placeholder="Drug License Number (optional)"
          value={form.dl_number}
          onChange={handleChange}
        />

        <button className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Admin Recovery Code (Local, optional) */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold mb-2">Admin Recovery Code (Optional)</h4>
        <p className="text-sm text-gray-700 mb-3">Store an admin recovery code on this machine for offline password recovery. This is stored locally and is not sent to the server.</p>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            name="admin_code"
            placeholder="Enter admin recovery code"
            value={form.admin_code || ''}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => {
              if (form.admin_code && form.admin_code.trim()) {
                localStorage.setItem('admin_recovery_code', form.admin_code.trim());
                setMessage({ type: 'success', text: 'Admin Recovery Code saved locally.' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                setForm({ ...form, admin_code: '' });
              } else {
                localStorage.removeItem('admin_recovery_code');
                setMessage({ type: 'success', text: 'Admin Recovery Code removed.' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
              }
            }}
            className="btn-primary"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
