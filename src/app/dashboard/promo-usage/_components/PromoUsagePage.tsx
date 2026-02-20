"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  Download,
  DollarSign,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PromoUsageData {
  bookings: Array<{
    _id: string;
    user: {
      name: string;
      email: string;
      phone: string;
    };
    promoCode: {
      code: string;
      discountType: string;
      discountValue: number;
      usageCount: number;
      usageLimit: number;
    };
    service: string;
    room: string;
    date: string;
    timeSlots: Array<{ start: string; end: string }>;
    total: number;
    createdAt: string;
    // Email tracking information
    promoCodeEmailStatus: string;
    promoCodeEmailSentAt: string | null;
    promoCodeEmailMessageId: string | null;
  }>;
  totalCount: number;
  totalSavings: string;
  uniquePromoCodesCount: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface PromoUsageSummary {
  period: string;
  summary: {
    totalPromoCodes: number;
    activePromoCodes: number;
    totalUsage: number;
    totalSavings: string;
    uniqueUsers: number;
  };
  topPromoCodes: Array<{
    promoCode: string;
    usageCount: number;
    totalSavings: number;
    lastUsed: string;
    uniqueUsers: number;
  }>;
  allPromoCodes: Array<{
    _id: string;
    code: string;
    discountType: string;
    discountValue: number;
    usedCount: number;
    usageLimit: number;
    expiryDate: string;
    active: boolean;
  }>;
}

export function PromoUsagePage() {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "users">(
    "overview"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<PromoUsageSummary | null>(
    null
  );
  const [usageData, setUsageData] = useState<PromoUsageData | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    startDate: "",
    endDate: "",
    promoCode: "",
    period: "30",
  });

  // Fetch summary data
  const fetchSummaryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Debug: Token from session:', token ? 'Token exists' : 'No token found');
      console.log('🔍 Debug: Session status:', session.status);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/promo-usage/summary?period=${filters.period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: Failed to fetch summary data`
        );
      }

      const result = await response.json();
      setSummaryData(result.data);
    } catch (error) {
      console.error("Error fetching summary data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load summary data"
      );
      toast.error("Failed to load summary data");
    } finally {
      setLoading(false);
    }
  }, [filters.period, token, session.status]);

  // Fetch usage details
  const fetchUsageData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Debug: Token from session:', token ? 'Token exists' : 'No token found');
      console.log('🔍 Debug: Session status:', session.status);

      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.promoCode && { promoCode: filters.promoCode }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/promo-usage?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: Failed to fetch usage data`
        );
      }

      const result = await response.json();
      setUsageData(result.data);
    } catch (error) {
      console.error("Error fetching usage data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load usage data"
      );
      toast.error("Failed to load usage data");
    } finally {
      setLoading(false);
    }
  }, [
    filters.page,
    filters.limit,
    filters.startDate,
    filters.endDate,
    filters.promoCode,
    token,
    session.status,
  ]);

  useEffect(() => {
    // Only make API calls when session is loaded and user is authenticated
    if (session.status === 'loading') {
      setLoading(true);
      setError(null);
      return; // Still loading
    }
    
    if (session.status === 'unauthenticated') {
      setError('Please log in to access this page.');
      setLoading(false);
      return;
    }
    
    // Only proceed if we have a valid token
    if (!token) {
      setError('No authentication token found. Please log out and log back in to refresh your authentication token.');
      setLoading(false);
      return;
    }
    
    if (activeTab === "overview") {
      fetchSummaryData();
    } else {
      fetchUsageData();
    }
  }, [activeTab, session.status, token, fetchSummaryData, fetchUsageData]);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.promoCode && { promoCode: filters.promoCode }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/promo-usage/export?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to export data");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `promo-usage-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  const formatCurrency = (amount: string | number) => {
    return `$${typeof amount === "string" ? amount : amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatTimeSlots = (
    timeSlots: Array<{ start: string; end: string }>
  ) => {
    return timeSlots.map((slot) => `${slot.start} - ${slot.end}`).join(", ");
  };

  const getEmailStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return { variant: 'default' as const, text: '✅ Sent', color: 'text-green-600' };
      case 'failed':
        return { variant: 'destructive' as const, text: '❌ Failed', color: 'text-red-600' };
      case 'not_sent':
      default:
        return { variant: 'secondary' as const, text: '⏳ Not Sent', color: 'text-gray-600' };
    }
  };

  if (loading || session.status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600">
          {session.status === 'loading' ? 'Loading authentication...' : 'Loading data...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Promo Code Usage
            </h1>
            <p className="text-gray-600 mt-1">
              Track and analyze promo code usage across your platform
            </p>
          </div>
        </div>

        {/* Error State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 mb-4">
              <BarChart3 className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Data
            </h3>
            <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
            {error.includes('authentication token') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                  <strong>💡 Solution:</strong> Please log out and log back in to refresh your authentication token.
                </p>
              </div>
            )}
            <Button
              onClick={() => {
                setError(null);
                if (activeTab === "overview") {
                  fetchSummaryData();
                } else {
                  fetchUsageData();
                }
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promo Code Usage</h1>
          <p className="text-gray-600 mt-1">
            Track and analyze promo code usage across your platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === "overview"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === "details"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          Usage Details
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {summaryData ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Promo Codes
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {summaryData.summary.totalPromoCodes}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {summaryData.summary.activePromoCodes} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Usage
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {summaryData.summary.totalUsage}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {summaryData.summary.uniqueUsers} unique users
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Savings
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(summaryData.summary.totalSavings)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Customer savings
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Period
                    </CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {summaryData.period}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      days analyzed
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Promo Codes */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Promo Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Promo Code</TableHead>
                        <TableHead>Usage Count</TableHead>
                        <TableHead>Unique Users</TableHead>
                        <TableHead>Total Savings</TableHead>
                        <TableHead>Last Used</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summaryData.topPromoCodes.map((promo, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {promo.promoCode}
                          </TableCell>
                          <TableCell>{promo.usageCount}</TableCell>
                          <TableCell>{promo.uniqueUsers}</TableCell>
                          <TableCell>
                            {formatCurrency(promo.totalSavings)}
                          </TableCell>
                          <TableCell>{formatDate(promo.lastUsed)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* All Promo Codes */}
              <Card>
                <CardHeader>
                  <CardTitle>All Promo Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expiry</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summaryData.allPromoCodes.map((promo) => (
                        <TableRow key={promo._id}>
                          <TableCell className="font-medium">
                            {promo.code}
                          </TableCell>
                          <TableCell>{promo.discountType}</TableCell>
                          <TableCell>{promo.discountValue}</TableCell>
                          <TableCell>
                            {promo.usedCount} / {promo.usageLimit || "∞"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={promo.active ? "default" : "secondary"}
                            >
                              {promo.active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(promo.expiryDate)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-gray-400 mb-4">
                  <BarChart3 className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Data Available
                </h3>
                <p className="text-gray-600 mb-4 text-center max-w-md">
                  No promo code usage data found for the selected period. Try
                  adjusting the time period or check back later.
                </p>
                <Button
                  onClick={() => fetchSummaryData()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Refresh Data
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Details Tab */}
      {activeTab === "details" && (
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="promoCode">Promo Code</Label>
                  <Input
                    id="promoCode"
                    placeholder="Enter promo code"
                    value={filters.promoCode}
                    onChange={(e) =>
                      setFilters({ ...filters, promoCode: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="limit">Items per page</Label>
                  <Select
                    value={filters.limit.toString()}
                    onValueChange={(value) =>
                      setFilters({ ...filters, limit: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Details Table */}
          {usageData ? (
            <Card>
              <CardHeader>
                <CardTitle>Usage Details</CardTitle>
                <p className="text-sm text-gray-600">
                  Showing {usageData.bookings.length} of {usageData.totalCount}{" "}
                  records
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Promo Code</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Email Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageData.bookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {booking.user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.user.email}
                            </div>
                            {booking.user.phone && (
                              <div className="text-sm text-gray-500">
                                {booking.user.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {booking.promoCode.code}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.promoCode.discountType}:{" "}
                              {booking.promoCode.discountValue}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.room}</TableCell>
                        <TableCell>{formatDate(booking.date)}</TableCell>
                        <TableCell className="text-sm">
                          {formatTimeSlots(booking.timeSlots)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(booking.total)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-start">
                            <Badge variant={getEmailStatusBadge(booking.promoCodeEmailStatus).variant}>
                              {getEmailStatusBadge(booking.promoCodeEmailStatus).text}
                            </Badge>
                            {booking.promoCodeEmailSentAt && (
                              <div className="text-xs text-gray-500 mt-1">
                                Sent: {formatDate(booking.promoCodeEmailSentAt)}
                              </div>
                            )}
                            {booking.promoCodeEmailMessageId && (
                              <div className="text-xs text-gray-400 mt-1">
                                ID: {booking.promoCodeEmailMessageId.slice(0, 8)}...
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(booking.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {usageData.pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-600">
                      Page {usageData.pagination.page} of{" "}
                      {usageData.pagination.totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={filters.page === 1}
                        onClick={() =>
                          setFilters({ ...filters, page: filters.page - 1 })
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          filters.page === usageData.pagination.totalPages
                        }
                        onClick={() =>
                          setFilters({ ...filters, page: filters.page + 1 })
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-gray-400 mb-4">
                  <BarChart3 className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Usage Data Found
                </h3>
                <p className="text-gray-600 mb-4 text-center max-w-md">
                  No promo code usage records found for the selected filters.
                  Try adjusting your search criteria or date range.
                </p>
                <Button
                  onClick={() => fetchUsageData()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Refresh Data
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
