import AddInfoFormV0 from "@/components/component/add-info-formv0";
import { createSupabaseServer } from "@/lib/supabase/server";
import React from "react";
import { toast } from "sonner";

function AddInfo() {
  async function addUserIncident(
    full_name: any,
    email: any,
    lat: any,
    long: any,
    picture_url: any
  ) {
    "use server";
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from("userIncidentLocations")
      .insert([
        {
          full_name: full_name,
          email: email,
          lat: lat,
          long: long,
          picture_url: picture_url,
        },
      ]);

    console.log(data);
    if (error) {
      console.error(error);
      return;
    }
  }
  return (
    <div className="pt-10 container">
      <div>
        <AddInfoFormV0 addUserIncident={addUserIncident} />
      </div>
    </div>
  );
}

export default AddInfo;
