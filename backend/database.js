const mongoose = require('mongoose');

const connectToMongo = async () => {
    try {
        await mongoose.connect('mongodb+srv://hashirshakeel044:IT0Hu95GaxF3cBB3@cluster0.jy3t1.mongodb.net/ecommerce', {
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectToMongo;





import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../AppTools/Pagination";
import axios from "../../../lib/axios";
import { API_BASE_URL } from "../../../env";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "../../AppTools/Spinner";
import { FiRefreshCw, FiExternalLink } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import TruncateWithTooltip from "../../ui/trancate-tooltip";
import DetailPop from "../../../Pages/WorkspaceAdministration/SiteLog/DetailPop";

export default function PlatformLog() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // --- FILTER STATE ------------------------------------
  const defaultFilters = {
    action_type: "",
    action_status: "",
    user_type: "",
    start_date: "",
    end_date: "",
  };
  const [filterState, setFilterState] = useState({ ...defaultFilters });
  const [range, setRange] = useState([null, null]);
  const dateRef = useRef(null);
  const [statusVal, setStatusVal] = useState("");
  const [userVal, setUserVal] = useState("");
  const [loading, setLoading] = useState(true);

  // --- DETAIL POPUP STATE -----------------------------
  const [detailPopOpen, setDetailPopOpen] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState(null);

  // --- LOG LIST + PAGINATION --------------------------
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
    totalItems: 0,
  });

  // --- FILTER HANDLERS ---------------------------------
  const handleFilterChange = changed => {
    const updated = { ...filterState, ...changed };
    setFilterState(updated);
    fetchLogs(1, updated);
  };

  const clearFilters = () => {
    setFilterState({ ...defaultFilters });
    setRange([null, null]);
    setStatusVal("");
    setUserVal("");
    if (dateRef.current) dateRef.current.clear();
    fetchLogs(1, defaultFilters);
  };

  // --- API CALL ----------------------------------------
  const fetchLogs = async (page = 1, filters = filterState) => {
    const { action_status, user_type, start_date, end_date } = filters;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/researchers/logs?page=${page}` +
        `&action_status=${action_status}` +
        `&user_type=${user_type}` +
        `&start_date=${start_date}` +
        `&end_date=${end_date}` +
        `&limit=${pagination.itemsPerPage}`
      );
      if (res.status === 200) {
        console.log("Logs fetched successfully:", res.data.data);
        setLogs(res.data.data);
        setPagination({
          currentPage: res.data.pagination.currentPage,
          itemsPerPage: res.data.pagination.itemsPerPage,
          totalPages: res.data.pagination.totalPages,
          totalItems: res.data.pagination.totalItems,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = page => fetchLogs(page);

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const handleShowDetails = logEntry => {
    setSelectedLogDetails(logEntry);
    setDetailPopOpen(true);
  };

  return (
    <div className="mx-auto max-w-full rounded-lg bg-white p-6 shadow">
      {/* Detail Popup */}
      <DetailPop
        bulkImportDetailPop={detailPopOpen}
        setBulkImportDetailPop={setDetailPopOpen}
        selectedLogDetails={selectedLogDetails}
      />

      {/* Filters */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            {t("commonTxt.filters")}
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {/* Date Range */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-600">Date Range</label>
            <DatePicker
              selected={range[0]}
              onChange={update => {
                setRange(update);
                if (update && update[0] && update[1]) {
                  // adjust to ISO yyyy-MM-dd
                  const toISO = d =>
                    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                      .toISOString()
                      .split("T")[0];
                  handleFilterChange({
                    start_date: toISO(update[0]),
                    end_date: toISO(update[1]),
                  });
                } else {
                  handleFilterChange({ start_date: "", end_date: "" });
                }
              }}
              startDate={range[0]}
              endDate={range[1]}
              selectsRange
              isClearable
              placeholderText="Select date range"
              className="h-10 w-full cursor-pointer rounded-md border border-gray-200 p-2 text-gray-600"
            />
          </div>

          {/* Status (select) */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-600">
              {t("commonTxt.status")}
            </label>
            <select
              value={statusVal}
              onChange={e => {
                const v = e.target.value;
                setStatusVal(v);
                handleFilterChange({ action_status: v });
              }}
              className="h-10 cursor-pointer rounded-md border border-gray-200 p-2 text-gray-600"
            >
              <option value="">All</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>

          {/* User Type (select) */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-600">
              {t("actionLogPage.userType")}
            </label>
            <select
              value={userVal}
              onChange={e => {
                const v = e.target.value;
                setUserVal(v);
                handleFilterChange({ user_type: v });
              }}
              className="h-10 cursor-pointer rounded-md border border-gray-200 p-2 text-gray-600"
            >
              <option value="">All</option>
              {[
                "researcher",
                "observer",
                "collaborator",
                "participant",
                "superadmin",
              ].map(item => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-end space-x-6">
          <button
            onClick={clearFilters}
            className="flex cursor-pointer items-center gap-1 text-sm text-[#6147D6] hover:underline focus:outline-none"
            title="Reset filters"
          >
            <FiRefreshCw className="inline-block" />
            {t("commonTxt.clear")}
          </button>
          <span className="text-sm text-gray-600">
            {pagination.totalItems} items match
          </span>
        </div>
      </div>

      {/*divider*/}
      <hr className="my-6 border-gray-200" />

      {/* Logs Table */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Event Logs</h3>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <div className="relative min-h-[200px]">
          {loading && (
            <div className="bg-opacity-60 absolute inset-0 z-10 flex items-center justify-center bg-white">
              <Spinner />
            </div>
          )}
          <table className="min-w-full bg-white text-sm">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                {[
                  "status",
                  "workspace",
                  "projects",
                  "summary",
                  "uName",
                  "uType",
                  "date",
                  "ipAddress",
                  "deviceInfo",
                ].map(key => (
                  <th
                    key={key}
                    className="px-4 py-2 text-left font-semibold whitespace-nowrap text-gray-700"
                  >
                    {key === "date"
                      ? t(`platformLogPage.${key}`)
                      : key === "ipAddress"
                        ? "IP Address"
                        : key === "deviceInfo"
                          ? "Device Info"
                          : t(`commonTxt.${key}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No logs found for the selected filters.
                  </td>
                </tr>
              )}
              {!loading &&
                logs.map((el, idx) => (
                  <tr
                    key={idx}
                    className={
                      "transition hover:bg-gray-50 " +
                      (idx % 2 === 0 ? "bg-white" : "bg-gray-50")
                    }
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs font-semibold ${el.action_status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {el.action_status}
                      </span>
                    </td>
                    <TruncateWithTooltip
                      element={
                        <td className="max-w-[120px] px-4 py-3 text-gray-700" />
                      }
                      text={el.workspace_name}
                      length={12}
                    />

                    <TruncateWithTooltip
                      element={
                        <td
                          className="max-w-[120px] px-4 py-3 text-gray-700"
                          title={el.project_name}
                        />
                      }
                      text={el.project_name}
                      length={17}
                    />

                    <td className="px-4 py-3">
                      <div className="flex flex-col text-sm">
                        <TruncateWithTooltip
                          element={
                            <span
                              className="max-w-[160px]"
                              title={el.action_type}
                            />
                          }
                          text={el?.action_type
                            ?.split("_")
                            ?.map(
                              word =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                          length={20}
                        />
                        {/* <span
                          className="max-w-[160px] truncate"
                          title={el.action_type}
                        >
                          {el?.action_type
                            ?.split("_")
                            ?.map(
                              word =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </span> */}
                        <Tooltip className="" title="View Details" arrow>
                          <button
                            className="mt-1 flex cursor-pointer items-center gap-1 p-0 text-sm text-[#6147D6] hover:underline"
                            onClick={() => handleShowDetails(el)}
                          >
                            <FiExternalLink className="inline-block" />
                            <span className="sr-only">Details</span>
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <TruncateWithTooltip
                          element={
                            <span
                              className="max-w-[120px] text-sm font-medium"
                              title={el.user_details[0]?.name}
                            />
                          }
                          text={el.user_details[0]?.name}
                          length={12}
                        />
                        {/* <span
                          className="max-w-[120px]  text-sm font-medium"
                          title={el.user_details[0]?.name}
                        >
                          {el.user_details[0]?.name}
                        </span> */}
                        <TruncateWithTooltip
                          element={
                            <span
                              className="max-w-[120px] text-xs text-gray-500"
                              title={
                                el.user_details[0]?.username
                                  ? `@${el.user_details[0].username}`
                                  : "..."
                              }
                            />
                          }
                          text={
                            el.user_details[0]?.username
                              ? `@${el.user_details[0].username}`
                              : "..."
                          }
                          length={20}
                        />

                        {/* <span
                          className="max-w-[120px]  text-xs text-gray-500"
                          title={
                            el.user_details[0]?.username
                              ? `@${el.user_details[0].username}`
                              : "..."
                          }
                        >
                          {el.user_details[0]?.username
                            ? `@${el.user_details[0].username}`
                            : "..."}
                        </span> */}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{el.user_type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {moment(el.created_at).format("YYYY-MM-DD")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination paginationData={pagination} onPageChange={onPageChange} />
      </div>
    </div>
  );
}<td className="px-4 py-3 text-gray-700">
  {el.ipAddress || "-"}
</td>
<td className="px-4 py-3 text-gray-700">
  {el.deviceInfo || "-"}
</td>





