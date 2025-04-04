import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
import { getSeasons } from "@/store/slices/seasonSlice";
import SeasonTable from "@/components/modules/SeasonTable";
import { AddSeason } from "@/components/forms/AddSeason";

const Seasons = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, loading} = useSelector((state: RootState) => state.season);

  useEffect(() => {
    dispatch(getSeasons({limit: 100000, sortBy: "createdAt:desc", search}));
  }, [search]);


  return (
    <>
      <Header title="Seasons" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Seasons</h2>
          <Button onClick={() => setOpen(!open)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Season
          </Button>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Season Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search season..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
          </CardHeader>
          <CardContent>
            <SeasonTable data={data} loading={loading} />
          </CardContent>
        </Card>
        <AddSeason open={open} type="global" setOpen={setOpen}/>
      </div>
    </>
  );
};

export default Seasons;
